set shell := ["bash", "-uc"]

# ────────────────────────────────────────
# Variables
# ────────────────────────────────────────

back_dir := "back"
front_dir := "front"
infra_dir := "infra"
openapi_dir := "openapi"
env := env("ENV", "dev")
dc := if env == "prod" { "docker compose --env-file .env -f " + infra_dir + "/docker-compose.yml -f " + infra_dir + "/docker-compose.prod.yml" } else { "docker compose --env-file .env -f " + infra_dir + "/docker-compose.yml -f " + infra_dir + "/docker-compose.override.yml" }
bundle := openapi_dir + "/build/bundle.yaml"
bundle_json := openapi_dir + "/build/bundle.json"

# ────────────────────────────────────────
# Setup / Infra
# ────────────────────────────────────────

# 初回セットアップ（.env コピー → ビルド → 初期化）
setup:
    [ -f .env ] || cp .env.example .env
    [ -f {{ back_dir }}/.env ] || cp {{ back_dir }}/.env.example {{ back_dir }}/.env
    [ -f {{ front_dir }}/.env ] || cp {{ front_dir }}/.env.example {{ front_dir }}/.env
    just build
    just init

# コンテナ起動
up:
    {{ dc }} up -d

# コンテナビルド＆起動
build:
    {{ dc }} up -d --build

# コンテナ停止
down:
    {{ dc }} down

# コンテナ再起動
restart:
    just down
    just up

# コンテナログ表示
logs:
    {{ dc }} logs -f --tail=200

# コンテナ一覧表示
ps:
    {{ dc }} ps

# app コンテナにシェル接続
sh:
    {{ dc }} exec app sh

# ────────────────────────────────────────
# Backend (Docker)
# ────────────────────────────────────────

# 初期化（key 生成・JWT secret・マイグレーション＆シード）
init:
    {{ dc }} exec app php artisan key:generate --ansi
    {{ dc }} exec app php artisan jwt:secret --ansi
    {{ dc }} exec app php artisan migrate --seed --force

# マイグレーション実行
migrate:
    {{ dc }} exec app php artisan migrate --force

# シーダー実行
seed:
    {{ dc }} exec app php artisan db:seed --force

# DB 初期化（migrate:fresh --seed）
fresh:
    {{ dc }} exec app php artisan migrate:fresh --seed --force

# テスト実行
test:
    {{ dc }} exec app php artisan test

# 本番用キャッシュ最適化
optimize:
    {{ dc }} exec app composer optimize-prod

# ────────────────────────────────────────
# Frontend
# ────────────────────────────────────────

# フロント依存パッケージインストール
front-install:
    cd {{ front_dir }} && pnpm install

# フロント開発サーバー起動
front-dev:
    cd {{ front_dir }} && pnpm dev --host --port 5173 --strictPort

# フロントビルド
front-build:
    cd {{ front_dir }} && pnpm build

# フロント型チェック
front-typecheck:
    cd {{ front_dir }} && pnpm typecheck

# フロント Lint
front-lint:
    cd {{ front_dir }} && pnpm lint

# ────────────────────────────────────────
# Local development (Docker なし)
# ────────────────────────────────────────

# Laravel 開発サーバー（ローカル）
local-back:
    cd {{ back_dir }} && php artisan serve --host=0.0.0.0 --port=8000

# ヘルスチェック
health:
    curl -fsS http://localhost:${APP_PORT:-8000}/api/health && echo

# ────────────────────────────────────────
# OpenAPI
# ────────────────────────────────────────

# OpenAPI Lint
openapi-lint:
    npx @redocly/cli lint {{ openapi_dir }}/openapi.yaml

# OpenAPI バンドル（lint → YAML + JSON 出力）
openapi-bundle: openapi-lint
    mkdir -p {{ openapi_dir }}/build
    npx @redocly/cli bundle {{ openapi_dir }}/openapi.yaml -o {{ bundle }}
    npx @redocly/cli bundle {{ openapi_dir }}/openapi.yaml --dereferenced --ext json -o {{ bundle_json }}

# TypeScript API クライアント生成
openapi-client: openapi-bundle
    npx --prefix {{ front_dir }} orval

# Zod スキーマ生成
openapi-zod: openapi-bundle
    npx --prefix {{ front_dir }} openapi-zod {{ bundle }} -o {{ front_dir }}/src/__generated__/zod.ts

# バリデーター生成
openapi-validators: openapi-bundle openapi-zod
    node openapi/scripts/generators/validators.mjs
    npx prettier --write ./front/src/__generated__/zod.validation.ts

# 生成物クリーン
openapi-clean:
    rm -rf {{ openapi_dir }}/build/*
    rm -rf {{ openapi_dir }}/examples/*
    rm -rf {{ front_dir }}/src/__generated__/*
    rm -rf {{ back_dir }}/app/__Generated__/*

# PHP / TypeScript Enum 生成
openapi-enums:
    node openapi/scripts/generators/php-enums.mjs
    node openapi/scripts/generators/ts-enums.mjs

# PHP Response DTO 生成
openapi-php-dto:
    node openapi/scripts/generators/php-response-dtos.mjs

# OpenAPI 全生成（enums → PHP DTO → zod → client → validators）
openapi: openapi-enums openapi-php-dto openapi-zod openapi-client openapi-validators

# ────────────────────────────────────────
# Compound / Utility
# ────────────────────────────────────────

# 開発モード起動（OpenAPI 生成 → バックエンドサーバー起動。フロントは別ターミナルで just front-dev）
dev: openapi
    cd {{ back_dir }} && php artisan serve --host=0.0.0.0 --port=8000

# PostgreSQL に直接接続
in-db:
    sudo -u postgres psql
