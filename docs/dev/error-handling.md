# エラーハンドリング方針

## 設計思想

- エラーは **発生源で分類** し、適切な HTTP HTTPステータスコードにマッピングする
- フロントエンドでは **一元的なエラーモーダル** でユーザーに通知する
- バリデーションエラーのみフィールド単位でインライン表示する

---

## バックエンド

### 例外 → HTTP ステータスマッピング

| 例外クラス | HTTP Status | エラーコード |
|---|---|---|
| `App\Exceptions\DomainException` | 400 | `DOMAIN_ERROR` |
| `AuthenticationException` | 401 | `AUTH_ERROR` |
| `AuthorizationException` | 403 | `FORBIDDEN_ERROR` |
| `ValidationException` | 422 | `VALIDATION_ERROR` |
| その他 | 500 | `INTERNAL_ERROR` |

### DomainException の使い方

ビジネスルール違反はすべて `App\Exceptions\DomainException` を投げる。

```php
use App\Exceptions\DomainException;

// ✅ 正しい — カスタムエラーコード付き
throw new DomainException('既に出勤済みです', 'OPEN_ATTENDANCE_EXISTS');

// ✅ 正しい — コードなし（デフォルト 'DOMAIN_ERROR'）
throw new DomainException('既に出勤済みです');

// ❌ 間違い — PHP 標準の DomainException を使ってはいけない
throw new \DomainException('...');
```

> **重要**: `App\Exceptions\DomainException` を使うこと。PHP 標準の `\DomainException` では Handler が正しい HTTP ステータスにマッピングできず 500 が返る。

### HTTPレスポンス構造

DomainException のHTTPレスポンス（カスタムエラーコード例）:

```json
{
  "success": false,
  "message": "既に出勤済みです",
  "data": null,
  "code": "OPEN_ATTENDANCE_EXISTS",
  "errors": null
}
```

バリデーションエラー時はフィールドごとのエラーが `errors` に含まれる:

```json
{
  "success": false,
  "message": "バリデーションエラー",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["メールアドレスは必須です。"],
    "password": ["パスワードは8文字以上で入力してください。"]
  }
}
```

### ログ出力

- 4xx エラー: `warning` レベル
- 5xx エラー: `error` レベル（スタックトレース付き）
- 構造化 JSON ログで `request_id`, `user_id`, `ip` を自動付与

---

## フロントエンド

### エラー処理フロー

```
API エラー発生
  ↓
Axios インターセプター（lib/http/client.ts）
  ↓
ApiError 型に変換（lib/http/api-error.ts）
  ↓
ErrorContext に送出
  ↓
ErrorModal で表示
```

### エラーコード型

```typescript
type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'FORBIDDEN_ERROR'
  | 'DOMAIN_ERROR'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';
```

### バリデーションエラーの表示

- フォームフィールドの下にインラインで表示
- React Hook Form + Zod がフロント側で先にバリデーションする
- サーバーサイドのバリデーションエラーも `setError()` でフォームに反映可能

### リトライ戦略（React Query）

| 条件 | リトライ |
|---|---|
| 4xx エラー | リトライしない |
| 5xx エラー | 最大 3 回 |
| ネットワークエラー | 最大 3 回 |
| バックオフ | 指数的: 1s → 2s → 4s（上限 30s） |

## 設計レビュー指摘事項

| 区分 | 指摘 |
|---|---|
| 🚨 問題 | `AuthService::refresh()` で `AuthenticationException` が未 import のため、リフレッシュ失敗時に 500 が返る |
| 🚨 問題 | ログイン失敗（401）時にフロントエンドの UI フィードバックがない（インターセプターが `return` して何も表示しない） |
| 💡 改善 | ErrorBoundary がフロントエンドに未配置。レンダーエラーで全画面ホワイトアウトする。`<ErrorBoundary>` を App.tsx に追加すべき |
| 💡 改善 | ErrorModal に ESC キー、フォーカストラップ、`role="dialog"` / `aria-modal` が未実装 |
| ⚠️ アンチパターン | `console.error` で本番環境でもHTTPリクエスト/HTTPレスポンス全体を出力している。機密情報露出リスク |
