# Docker 開発環境ガイド

## コンテナ構成

| サービス | イメージ | ポート | 用途 |
|---|---|---|---|
| nginx | nginx:1.27-alpine | 80 | リバースプロキシ |
| app | PHP 8.4 FPM | 9000 (内部) | Laravel バックエンド |
| front | Node 20-alpine | 5173 | Vite 開発サーバー |
| db | PostgreSQL 15-alpine | 5432 | データベース |
| redis | Redis 7-alpine | 6379 | キャッシュ / セッション |

## Docker Compose ファイル構成

| ファイル | 用途 |
|---|---|
| `infra/docker-compose.yml` | ベース定義 |
| `infra/docker-compose.override.yml` | 開発環境オーバーライド |
| `infra/docker-compose.prod.yml` | 本番環境設定 |

### 開発環境の特徴

- ソースコードをボリュームマウント（ホットリロード対応）
- Xdebug が有効
- Vite の HMR（Hot Module Replacement）が有効（WebSocket 接続あり）
- DB / Redis のポートがホストに公開される

### 本番環境の特徴

- `restart: always` で自動再起動
- リソース制限（CPU / メモリ）
- JSON ファイルログ（10MB × 3 ローテーション）
- ソースコードはイメージに内包

## マルチステージビルド

### PHP（Laravel）

```
base       → PHP 8.4 FPM + 拡張機能
vendor     → Composer 依存インストール
dev        → Xdebug + Composer CLI（開発用）
prod       → 最適化 php.ini + vendor（本番用）
```

### Node（React）

```
base       → Node 20 + pnpm install
dev        → Vite 開発サーバー
build      → 静的ビルド（dist/）
prod       → Nginx で dist/ を配信
```

## Nginx ルーティング

### 開発環境

```
/api/*    → PHP-FPM (app:9000)
/*        → Vite Dev Server (front:5173)
           WebSocket (ws://) も対応
```

### 本番環境

```
/api/*    → PHP-FPM (app:9000)
/*        → 静的ファイル (/var/www/frontend)
```

## よくある操作

### コンテナに入る

```bash
make sh   # app コンテナのシェルに入る
```

### DB に直接アクセス

```bash
docker compose -f infra/docker-compose.yml exec db psql -U postgres -d time_attendance
```

### ログ確認

```bash
make logs                    # 全サービスのログ
docker compose logs app -f   # app のみ
```

### 完全リセット

```bash
make down
docker volume rm time-attendance_postgres_data time-attendance_redis_data
make setup
```

## 環境変数

Docker Compose で使用する環境変数は `.env`（プロジェクトルート）に設定する:

```
COMPOSE_PROJECT_NAME=time-attendance
APP_BUILD_TARGET=dev        # dev or prod
FRONT_BUILD_TARGET=dev      # dev or prod
APP_PORT=80
DB_PORT=5432
REDIS_PORT=6379
```

## PostgreSQL 初期化

`infra/postgres/init.sql` が初回起動時に実行される:
- `uuid-ossp` 拡張の有効化
- `pgcrypto` 拡張の有効化
