# 認証・認可の設計

## 認証方式

JWT（JSON Web Token）ベースの認証を採用する。ライブラリは `tymon/jwt-auth`。

## 認証フロー

### ログイン

```
1. POST /api/login { email, password }
2. サーバー: 認証情報を検証
3. サーバー: JWT トークンを生成して返却
4. クライアント: localStorage にトークンを保存
5. クライアント: 以降のHTTPリクエストに Authorization ヘッダーを付与
```

### トークン管理

```
Authorization: Bearer eyJhbGciOi...
```

- トークンは `localStorage` に保存する（`time-attendance.auth-token` キー）
- Axios インターセプターで全HTTPリクエストに自動付与
- トークン操作は `lib/http/client.ts` の関数を経由する:
  - `getAuthToken()` — 取得
  - `setAuthToken(token)` — 保存
  - `clearAuthToken()` — 削除

### 認証状態の初期化

```
アプリ起動
  ↓
localStorage にトークンが存在するか？
  ├── Yes → GET /api/me でユーザー情報取得
  │         ├── 成功 → Zustand に保存 → isAuthenticated = true
  │         └── 失敗 → トークン削除 → ログイン画面へ
  └── No  → ログイン画面へ
```

### ログアウト

```
1. POST /api/logout（サーバー側でトークン無効化）
2. clearAuthToken()（localStorage 削除）
3. Zustand ストアをリセット
4. /login にリダイレクト
```

## ルート保護

### フロントエンド

```tsx
// AppRoutes.tsx
isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" />
```

### バックエンド

```php
// routes/api.php
Route::middleware('auth:api')->group(function () {
    // 認証が必要なルート
});
```

## 認可（Authorization）

### Policy パターン

Laravel の Policy で認可制御を実装する。

```php
// app/Policies/AttendancePolicy.php
class AttendancePolicy
{
    public function update(User $user, Attendance $attendance): bool
    {
        return $user->id === $attendance->user_id;
    }
}
```

### コントローラーでの利用

```php
$this->authorize('update', $attendance);
```

### 認可エラー

`AuthorizationException` が 403 にマッピングされる。

## セキュリティ上の注意

- JWT シークレットは `.env` の `JWT_SECRET` で管理する。公開リポジトリにコミットしない
- パスワードは bcrypt でハッシュ化する（Laravel 標準）
- ログインは **5回/分** のレートリミットを適用する
- トークンの有効期限は `config/jwt.php` の `ttl` で設定する
