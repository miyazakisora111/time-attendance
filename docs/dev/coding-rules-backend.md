# バックエンド コーディング規約

## PHP 全般

- PHP 8.4 の機能を積極的に利用する
- `declare(strict_types=1);` を全ファイルの先頭に記述する
- 型宣言は必須。戻り値型・引数型・プロパティ型すべて明示する
- `readonly` プロパティを積極的に使う
- PSR-12 準拠。`phpcs.xml` でチェックする

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| クラス | PascalCase | `AttendanceService` |
| メソッド | camelCase | `clockIn()` |
| プロパティ | camelCase | `$userId` |
| 定数 | UPPER_SNAKE | `MAX_BREAK_MINUTES` |
| DB カラム | snake_case | `clocked_in_at` |
| ルート | kebab-case | `/attendance-records` |
| Enum case | UPPER_SNAKE | `BREAK_START` |

## Controller

- 1 アクション = 1 メソッドを目安にする
- ビジネスロジックは **絶対に書かない**。Service に委譲する
- コンストラクタインジェクションで Service を注入する
- 認証ユーザーは `$this->resolveUser()` で取得する
- レスポンスは `ApiResponse::success()` / `ApiResponse::error()` を使う

```php
public function store(ClockRequest $request): JsonResponse
{
    $result = $this->attendanceService->clockIn($this->resolveUser(), $request->validated());
    return ApiResponse::success($result, '打刻が完了しました');
}
```

## Service

- `BaseService` を継承する
- メソッド名は **動詞始まり**: `clockIn()`, `getUser()`, `updateSettings()`
- ビジネスルール違反は `DomainException`（`App\Exceptions\DomainException`）を投げる
  - PHP 標準の `\DomainException` は使わないこと
- 副作用のある処理は `$this->transaction()` でラップする
- ログは `$this->log()` / `$this->logError()` を使う

## Model

- UUID 主キーを使う（`HasUuid` トレイト）
- 日付は `immutable_datetime` でキャストする
- `$fillable` ではなく `$guarded = []` + DTO/FormRequest でフィルタする方針は避ける。`$fillable` を明示する
- スコープは `scope` プレフィクスをつける: `scopeActive()`, `scopeMonth()`
- ドメインに密接なメソッドはモデルに置いてよい: `isClockedIn()`, `calculateWorkedMinutes()`

## 例外

- ドメインエラー → `App\Exceptions\DomainException`（400）
- バリデーションエラー → FormRequest が自動処理（422）
- 認証エラー → `AuthenticationException`（401）
- 認可エラー → `AuthorizationException`（403）
- 存在しない → `ModelNotFoundException`（404）

## バリデーション

- FormRequest は `BaseRequest` を継承する
- ルールは OpenAPI 定義から `OpenApiGeneratedRules::schema()` で自動取得する
- 追加ルールが必要な場合のみ `rules()` をオーバーライドする
- `$schemaName` プロパティに OpenAPI スキーマ名を設定する

## テスト

- `TestCase` を継承する
- `@test` アノテーションを使用する
- テスト名は `it_` で始める: `it_returns_authenticated_user()`
- 認証が必要なテストは `AuthenticatedUser` トレイトを使う
