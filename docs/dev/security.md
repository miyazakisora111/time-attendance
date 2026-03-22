# セキュリティ対策方針

## 認証・認可

### JWT トークン管理

- `JWT_SECRET` は `.env` で管理し、Git にコミットしない
- トークンの有効期限を適切に設定する（`config/jwt.php` の `ttl`）
- ログアウト時にサーバー側でトークンを無効化する

### パスワード

- bcrypt でハッシュ化（Laravel 標準）
- 最低 8 文字 + 英字 1 文字以上 + 数字 1 文字以上（`StrongPassword` ルール）
- パスワードを平文でログに出力しない

### レートリミット

- ログイン: 5 回 / 分（ブルートフォース対策）
- 認証済みAPI: 60 回 / 分

## 入力バリデーション

### サーバーサイド

- **すべての入力はサーバーサイドでバリデーションする**（クライアントサイドは UX 向上目的のみ）
- OpenAPI 定義から自動生成されたルールで型・長さ・パターンを検証する
- SQL インジェクション対策: Eloquent ORM のパラメータバインディングを使用する（生 SQL は原則禁止）

### XSS 対策

- React は JSX でデフォルトエスケープされる
- `dangerouslySetInnerHTML` は使用禁止
- API レスポンスは JSON のみ（HTML を返さない）

## HTTP ヘッダー

Nginx で以下のセキュリティヘッダーを設定する:

```
X-Frame-Options: SAMEORIGIN          # クリックジャッキング防止
X-Content-Type-Options: nosniff      # MIME スニッフィング防止
Referrer-Policy: strict-origin-when-cross-origin
```

## CORS

- `config/cors.php` で許可オリジンを制御する
- 本番環境ではフロントエンドの URL のみ許可する
- `Access-Control-Allow-Credentials: true` で Cookie を許可

## 環境変数

- `.env` ファイルは `.gitignore` に含める
- 機密情報（DB パスワード, JWT シークレット, API キー）は環境変数で管理する
- `.env.example` には実際の値を含めない

## ログ

- パスワードやトークンなどの機密情報はログに出力しない
- 構造化 JSON ログで `request_id` を付与し、追跡可能にする
- 4xx は `warning`、5xx は `error` レベルでログ出力する
- `user_id`, `ip`, `user_agent` を自動付与する

## 依存パッケージ

- 定期的に依存パッケージを更新する
- `composer audit` / `pnpm audit` で既知の脆弱性をチェックする

## ファイルアクセス

- `.htaccess` や dotfile へのアクセスは Nginx で拒否する
- `public/` ディレクトリ以外は Web からアクセスできない
- `storage/` ディレクトリのパーミッションを適切に設定する

## SSRF 対策

- ユーザー入力の URL をサーバーサイドでフェッチしない
- 外部 API 呼び出しは許可リスト方式で制御する

## 設計レビュー指摘事項

| 区分 | 指摘 |
|---|---|
| 🚨 問題 | JWT を localStorage に保存している（XSS でトークン奪取可能）。httpOnly + Secure + SameSite=Strict Cookie に移行すべき |
| 🚨 問題 | Nginx のセキュリティヘッダーが実設定ファイルに適用されていない。上記記載のヘッダーは設計のみで未実装 |
| 🚨 問題 | `console.error` が本番環境でもリクエスト/レスポンス全体を出力。パスワードなど機密情報が DevTools に露出する |
| 🚨 問題 | 本番ビルドで `sourcemap: true` が有効。ソースコードが閲覧可能 |
| 💡 改善 | `composer audit` / `pnpm audit` を CI に組み込んで自動チェックすべき |
| 💡 改善 | CSP（Content-Security-Policy）ヘッダーの追加が必要 |
| 💡 改善 | パスワード変更後に既存の JWT を無効化する仕組みがない |
| ⚠️ アンチパターン | UserPolicy が空スケルトン。認可チェックがないため、任意のユーザーが他人のリソースを操作可能 |
| ⚠️ アンチパターン | CORS 設定の本番環境での `allowed_origins` が `*` でないことの確認が必要 |
