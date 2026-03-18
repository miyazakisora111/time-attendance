# ローカルセットアップ手順

GitHubからcloneした直後の状態から、ログインが正常に動作するところまでの手順です。  
対象環境: **WSL2 / Linux (Ubuntu/Debian 系)**

---

## 目次

- [前提ソフトウェア](#前提ソフトウェア)
- [セットアップ方法の選択](#セットアップ方法の選択)
- [方法 A: Docker（推奨）](#方法-a-docker推奨)
- [方法 B: ローカル直接実行](#方法-b-ローカル直接実行)
- [動作確認](#動作確認)
- [よくあるトラブル](#よくあるトラブル)

---

## 方法 A: Docker

| ソフトウェア | 最低バージョン | 確認コマンド |
|---|---|---|
| Docker Engine | 24.x 以上 | `docker --version` |
| Docker Compose plugin | v2.x 以上 | `docker compose version` |

```bash
# Docker の公式インストール手順（Ubuntu）
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# sudo なしで docker を使えるようにする（設定後は再ログイン or exec bash が必要）
sudo usermod -aG docker $USER
newgrp docker
```
### 1. 環境ファイルのコピー

```bash
cd /path/to/time-attendance     # cloneしたディレクトリへ

cp .env.example .env
cp back/.env.example back/.env
cp front/.env.example front/.env
```

`.env`（compose 用）の主な設定変更が必要な場合:

```dotenv
# POSTGRES_PASSWORD は任意の強いパスワードに変更することを推奨
POSTGRES_PASSWORD=change_me
```

`back/.env` の `APP_KEY` と `JWT_SECRET` はこの後のコマンドで自動生成されます（空のまま OK）。

### 2. コンテナのビルドと起動

```bash
docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml up -d --build
```

初回はイメージのダウンロードとビルドに数分かかります。  
`docker compose ... ps` で全サービスが `Up` になるまで待ちます。

```bash
docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml ps
```

### 3. Laravel 初期化

```bash
# エイリアスを定義しておくと便利
COMPOSE="docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml"

# アプリケーションキーの生成（back/.env の APP_KEY が埋まる）
$COMPOSE exec app php artisan key:generate --ansi

# JWT シークレットの生成（back/.env の JWT_SECRET が埋まる）
$COMPOSE exec app php artisan jwt:secret --ansi

# マイグレーション＋初期データの投入
$COMPOSE exec app php artisan migrate --seed --force
```

> **注意**: コンテナ内の `back/.env` は bind mount されているため、ホスト側の `back/.env` に書き込まれます。

### 4. 起動確認

| サービス | URL |
|---|---|
| フロントエンド（Vite dev server） | http://localhost:5173 |
| バックエンド（nginx 経由） | http://localhost:8000 |
| API ヘルスチェック | http://localhost:8000/api/health |

---

## 方法 B: ローカル

| ソフトウェア | 最低バージョン | 確認コマンド |
|---|---|---|
| PHP | 8.1 以上（8.4 推奨） | `php --version` |
| Composer | 2.x | `composer --version` |
| Node.js | 20 LTS 以上 | `node --version` |
| pnpm | 10.x | `pnpm --version` |
| PostgreSQL | 15 以上 | `psql --version` |
| Redis | 7 以上 | `redis-server --version` |

```bash
# PPA の追加
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get update

# PHPのインストール
sudo apt-get install -y \
  php8.4 php8.4-cli php8.4-fpm \
  php8.4-pgsql php8.4-redis \
  php8.4-mbstring php8.4-xml php8.4-curl php8.4-zip php8.4-bcmath \
  unzip
php -v

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer -V

# nvm のインストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc

# Node.js 20 のインストール
nvm install 20
nvm use 20
node -v

# pnpm (corepack 経由)
corepack enable
corepack prepare pnpm@10.6.0 --activate
pnpm -v

# PostgreSQL 15
sudo apt-get install -y postgresql-15
psql --version

# Redis 7
sudo apt-get install -y redis-server
redis-server --version
sudo systemctl enable redis-server
sudo systemctl status redis-server

# env
cd /path/to/time-attendance
cp back/.env.example back/.env
cp front/.env.example front/.env
```

### 2. `back/.env` の編集

エディタで `back/.env` を開き、以下の項目を確認・変更します。

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=time_attendance
DB_USERNAME=time_attendance
DB_PASSWORD=change_me      # 下で作成するユーザーのパスワードに合わせる

REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. PostgreSQL のデータベース・ユーザー作成

```bash
# PostgreSQL を起動
sudo service postgresql start   # または: sudo systemctl start postgresql

# postgres ユーザーで psql を起動
sudo -u postgres psql <<'SQL'
CREATE USER time_attendance WITH PASSWORD 'change_me';
CREATE DATABASE time_attendance OWNER time_attendance;
GRANT ALL PRIVILEGES ON DATABASE time_attendance TO time_attendance;
SQL
```

> `back/.env` の `DB_PASSWORD` と `CREATE USER` のパスワードを一致させてください。

### 4. Redis の起動

```bash
# Redis を起動
sudo service redis-server start   # または: sudo systemctl start redis
redis-cli ping                    # PONG が返れば OK
```

### 5. PHP（バックエンド）のセットアップ

```bash
cd back

# Composer 依存パッケージのインストール
composer install

# アプリケーションキーの生成
php artisan key:generate --ansi

# JWT シークレットの生成
php artisan jwt:secret --ansi

# マイグレーション＋初期データの投入
php artisan migrate --seed

# 開発サーバーの起動（別ターミナルで）
php artisan serve --host=0.0.0.0 --port=8000
```

### 6. TypeScript（フロントエンド）のセットアップ

```bash
cd ../front

# Vite の API プロキシ先をローカルバックエンドに向ける
# front/.env を編集して以下に変更:
# VITE_API_BASE_URL=http://localhost:8000/api

# 依存パッケージのインストール
pnpm install

# 開発サーバーの起動（別ターミナルで）
pnpm dev --host --port 5173 --strictPort
```

`front/.env` のデフォルト値 `/api` は相対パスのため、バックエンドを直接 `localhost:8000` で立てる場合は `http://localhost:8000/api` に変更が必要です。

---

### ログイン API の確認

シーダーで以下のテストアカウントが作成されます。

| 項目 | 値 |
|---|---|
| メールアドレス | `test@test.com` |
| パスワード | `Password@1` |

```bash
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password@1"}' | jq
```

レスポンスに `access_token` が含まれれば成功です。

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### ログイン後の認証確認

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password@1"}' | jq -r .access_token)

curl -s http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## よくあるトラブル

### `APP_KEY` が空のままで 500 エラーになる

```bash
# Docker
docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml exec app php artisan key:generate --ansi

# ローカル
cd back && php artisan key:generate --ansi
```

### `JWT_SECRET` が空で 500 エラーになる

```bash
# Docker
docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml exec app php artisan jwt:secret --ansi

# ローカル
cd back && php artisan jwt:secret --ansi
```

### DB 接続エラー（`SQLSTATE[08006]` など）

- `back/.env` の `DB_HOST` / `DB_PORT` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` が正しいか確認
- PostgreSQL が起動しているか確認: `sudo service postgresql status`
- Docker モードでは `back/.env` の `DB_HOST` は無視され、compose の `environment` ブロックが優先されます

### Redis 接続エラー

- `sudo service redis-server status` で起動確認
- `redis-cli ping` → `PONG` が返るか確認

### `pnpm: command not found`

```bash
corepack enable
corepack prepare pnpm@10.6.0 --activate
```

### WSL で Vite の HMR（ホットリロード）が効かない

`front/.env` に以下を追加します（ファイル変更のポーリングが有効になります）:

```dotenv
VITE_USE_POLLING=true
```

または、Docker 経由で起動している場合は `infra/docker-compose.dev.yml` の `CHOKIDAR_USEPOLLING=true` が自動で適用されます。

### マイグレーションで `already exists` エラーが出る

```bash
# ローカル: テーブルを一度削除して再実行
php artisan migrate:fresh --seed

# Docker
docker compose -f infra/docker-compose.yml -f infra/docker-compose.dev.yml exec app php artisan migrate:fresh --seed --force
```

> `migrate:fresh` はすべてのテーブルを削除してから再作成します。開発環境専用です。

---

## 参考: ディレクトリ構成

```
time-attendance/
├── back/          # Laravel バックエンド
│   └── .env       # バックエンドの環境変数（非 Docker 時はここが直接使われる）
├── front/         # React + Vite フロントエンド
│   └── .env       # Vite の環境変数（VITE_ プレフィックスのみ）
├── infra/         # Docker Compose / nginx 設定
│   ├── docker-compose.yml        # 共通ベース
│   ├── docker-compose.dev.yml    # 開発用オーバーライド
│   └── docker-compose.prod.yml   # 本番用オーバーライド
└── .env           # compose 専用変数（ポート、DB 認証情報など）
```
