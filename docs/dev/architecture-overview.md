# アーキテクチャ概要

## プロジェクト概要

勤怠管理システム（time-attendance）は、打刻・勤怠履歴・チーム管理・ダッシュボードを提供する Web アプリケーションである。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React 19 + TypeScript + Vite |
| バックエンド | Laravel 11 (PHP 8.4) |
| データベース | PostgreSQL 15 |
| キャッシュ / セッション | Redis 7 |
| リバースプロキシ | Nginx 1.27 |
| コンテナ | Docker Compose |
| 認証 | JWT (tymon/jwt-auth) |
| API 仕様 | OpenAPI 3.0.3 |

## アーキテクチャ全体図

```
┌───────────────┐     ┌──────────┐     ┌──────────────┐
│   Browser     │────▶│  Nginx   │────▶│  Vite / SPA  │
│  (React SPA)  │     │          │     │  (静的配信)   │
└───────────────┘     │          │     └──────────────┘
                      │  /api/*  │
                      │    ↓     │
                      │ PHP-FPM  │────▶ Laravel App
                      └──────────┘         │
                                      ┌────┴────┐
                                      │         │
                                  PostgreSQL   Redis
```

## 設計思想

### Single Source of Truth（SSOT）

OpenAPI 定義をすべての型・バリデーションの単一ソースとする。

```
openapi/*.yaml
  ├─▶ TypeScript 型 + API クライアント (orval)
  ├─▶ Zod バリデーションスキーマ
  ├─▶ PHP Enum
  ├─▶ Laravel FormRequest ルール
  └─▶ TypeScript Enum
```

### レイヤードアーキテクチャ（バックエンド）

```
Controller → Service → Repository → Model
     ↑           ↑
  Request      DTO / ValueObject
     ↓
  Resource (ApiResponse)
```

- **Controller**: リクエスト受付と Service への委譲のみ
- **Service**: ビジネスロジックの実装
- **Repository**: データアクセスの抽象化
- **Model**: Eloquent ORM、リレーション定義

### Feature-Based 構成（フロントエンド）

```
features/
  ├── auth/        # hooks, state, ui
  ├── attendance/   # hooks, state, ui
  ├── dashboard/
  ├── schedule/
  ├── settings/
  └── team/
```

各 feature は `hooks/`・`state/`・`ui/` を持ち、依存方向は `features → shared → lib` の一方向。

## 環境構成

| 環境 | 説明 | 設定ファイル |
|---|---|---|
| ローカル開発 | Docker Compose + override | `docker-compose.override.yml` |
| 本番 | Docker Compose + prod | `docker-compose.prod.yml` |
| ベアメタル開発 | `make local-back` + `make front-dev` | `.env` 直接 |
