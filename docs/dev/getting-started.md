# 開発環境セットアップ

## 前提条件

- Docker & Docker Compose
- Node.js 20+
- pnpm 9+
- PHP 8.4+（ベアメタル開発時）
- Composer 2+（ベアメタル開発時）

## 初回セットアップ

### Docker 環境

```bash
# 1. リポジトリをクローン
git clone git@github.com:miyazakisora111/time-attendance.git
cd time-attendance

# 2. 初期セットアップ（.env コピー + ビルド + マイグレーション）
make setup

# 3. コンテナ起動
make up

# 4. フロントエンド依存インストール
make front-install
```

### ベアメタル開発

Docker を使わずにローカルで直接起動する場合：

```bash
# ターミナル 1: バックエンド
make local-back   # php artisan serve --port=8000

# ターミナル 2: フロントエンド
make front-dev    # vite dev --host --port 5173
```

## 環境変数

| ファイル | 用途 |
|---|---|
| `.env` | Docker Compose 用（ポート等） |
| `back/.env` | Laravel アプリケーション設定 |
| `front/.env` | Vite 環境変数（`VITE_` プレフィクス） |

各 `.env.example` をコピーして使用する。`make setup` で自動コピーされる。

## よく使うコマンド

### 開発

```bash
make up              # コンテナ起動
make down            # コンテナ停止
make restart         # 再起動
make logs            # ログ表示
make sh              # app コンテナに入る
```

### データベース

```bash
make migrate         # マイグレーション実行
make seed            # シーダー実行
make fresh           # DB リセット + シード
```

### テスト・品質

```bash
make test            # PHPUnit 実行
make front-typecheck # TypeScript 型チェック
make front-lint      # ESLint チェック
```

### OpenAPI コード生成

```bash
make openapi         # 全コード生成（enum → bundle → zod → client → validators → examples）
make openapi-enums   # PHP/TS Enum のみ生成
make openapi-bundle  # OpenAPI バンドルのみ
```

## 動作確認

```bash
make health          # GET /api/health → {"status":"ok"} を確認
```

## ポート一覧

| ポート | サービス |
|---|---|
| 80 | Nginx（本番） |
| 5173 | Vite Dev Server |
| 8000 | Laravel（ベアメタル） |
| 5432 | PostgreSQL |
| 6379 | Redis |
