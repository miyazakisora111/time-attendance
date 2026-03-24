# よくあるトラブルと対処法

## 開発環境

### Docker コンテナが起動しない

```bash
# ログを確認
make logs

# ポートの競合を確認
lsof -i :80
lsof -i :5432

# 完全リセット
make down
docker system prune -f
make setup
```

### Vite の HMR が動かない

- WebSocket 接続を確認する（ブラウザの DevTools → Network → WS）
- Nginx の開発用設定（`app.dev.conf`）が正しくマウントされているか確認:

```bash
docker compose -f infra/docker-compose.yml config | grep -A5 nginx
```

### `make local-back` でエラー

```bash
# PHP 拡張の確認
php -m | grep -E 'pdo_pgsql|redis|bcmath'

# .env の確認
cat back/.env | grep DB_

# マイグレーション
cd back && php artisan migrate
```

---

## データベース

### マイグレーションエラー

```bash
# ステータス確認
cd back && php artisan migrate:status

# 特定のマイグレーションだけロールバック
cd back && php artisan migrate:rollback --step=1

# 全リセット（開発環境のみ）
make fresh
```

### UUID 関連のエラー

PostgreSQL の `uuid-ossp` または `pgcrypto` 拡張が有効か確認:

```sql
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');
```

有効でなければ:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## OpenAPI / コード生成

### `make openapi` が失敗する

```bash
# 1. Lint で構文エラーを確認
make openapi-lint

# 2. 依存パッケージが入っているか確認
pnpm install
cd front && pnpm install

# 3. 個別に実行して原因を特定
make openapi-enums
make openapi-bundle
make openapi-zod
make openapi-client
make openapi-validators
```

### CI で「Generated enums are out of date」エラー

```bash
# ローカルで再生成してコミット
make openapi-enums
git add back/app/__Generated__/Enums/ front/src/__generated__/enums.ts
git commit -m "chore: update generated enums"
```

### CI で「Generated Laravel validation rules are out of date」エラー

```bash
make openapi
git add back/app/Http/Requests/Generated/ front/src/__generated__/
git commit -m "chore: update generated validators"
```

---

## 認証

### ログインできない

1. `.env` の `JWT_SECRET` が設定されているか確認
2. JWT シークレットが未生成なら生成:

```bash
cd back && php artisan jwt:secret
```

3. ユーザーが存在するか確認:

```bash
cd back && php artisan tinker
> User::where('email', 'test@example.com')->exists();
```

### 401 Unauthorized が返る

- トークンの有効期限が切れていないか確認
- `Authorization: Bearer {token}` ヘッダーが正しく送信されているか DevTools で確認
- Redis が動作しているか確認（セッション / キャッシュドライバーの場合）

---

## フロントエンド

### TypeScript の型エラーが大量に出る

```bash
# 自動生成ファイルを再生成
make openapi

# 型チェック
make front-typecheck
```

### `@/` パスが解決できない

`tsconfig.app.json` の `paths` 設定を確認:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### pnpm install でエラー

```bash
# ロックファイルを使用
cd front && pnpm install --frozen-lockfile

# それでもダメなら
rm -rf front/node_modules
cd front && pnpm install
```

---

## パフォーマンス

### API HTTPレスポンスが遅い

1. `make logs` で slow query を確認
2. N+1 問題を疑う → `with()` / `load()` でイーガーロード
3. インデックスが適切に設定されているか確認

### ビルドが遅い

```bash
# Docker のビルドキャッシュを活用
docker compose build --no-cache  # キャッシュが壊れている場合のみ

# front の node_modules をボリュームで共有
# → docker-compose.override.yml の front_node_modules を確認
```
