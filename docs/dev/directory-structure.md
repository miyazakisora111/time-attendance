# ディレクトリ構成

## プロジェクトルート

```
time-attendance/
├── back/                  # Laravel バックエンド
├── front/                 # React フロントエンド
├── openapi/               # OpenAPI 定義 + 自動生成スクリプト
├── infra/                 # Docker / インフラ設定
├── docker/                # Nginx 設定（レガシー）
├── docs/                  # ドキュメント
├── Makefile               # 統合タスクランナー
├── package.json           # ルートレベル npm scripts（コード生成用）
└── orval.config.ts        # API クライアント生成設定
```

## バックエンド (`back/`)

```
back/app/
├── __Generated__/         # 自動生成コード（手動編集禁止）
│   └── Enums/             #   OpenAPI 由来の PHP Enum
├── Console/               # Artisan コマンド
├── DTO/                   # Data Transfer Objects
├── Exceptions/            # カスタム例外（DomainException 等）
├── Http/
│   ├── Controllers/       # コントローラー（薄く保つ）
│   ├── Middleware/         # ミドルウェア（ログ、JSON 設定）
│   ├── Requests/          # FormRequest（バリデーション）
│   │   └── Generated/     #   OpenAPI 自動生成ルール
│   └── Resources/         # API HTTPレスポンス整形
├── Logging/               # カスタムログフォーマッタ
├── Models/                # Eloquent モデル
├── Policies/              # 認可ポリシー
├── Providers/             # サービスプロバイダー
├── Queries/               # CQRS クエリベース
├── Repositories/          # リポジトリパターン
├── Rules/                 # カスタムバリデーションルール
├── Services/              # ビジネスロジック
├── Traits/                # 共有トレイト（HasUuid 等）
└── ValueObjects/          # 値オブジェクト（Email 等）
```

## フロントエンド (`front/src/`)

```
front/src/
├── __generated__/         # 自動生成（API クライアント, 型, Enum, Zod）
├── api/                   # API ラッパー（Result<T> パターン）
├── app/                   # アプリルート（App, Providers, Routes）
├── config/                # グローバル設定（API, 認証, ルーティング, 定数）
├── domain/                # ドメインモデル・ビジネスロジック
├── features/              # 機能モジュール（各 hooks/ state/ ui/）
│   ├── attendance/
│   ├── auth/
│   ├── dashboard/
│   ├── schedule/
│   ├── settings/
│   └── team/
├── lib/                   # 低レベルユーティリティ
│   ├── http/              #   Axios クライアント, エラー型
│   └── query/             #   React Query 設定
└── shared/                # 共有リソース
    ├── components/        #   UI コンポーネント
    ├── contexts/          #   React Context（ErrorContext）
    ├── design-system/     #   トークン, レイアウト, CVA variants
    ├── hooks/             #   共通フック
    └── utils/             #   ユーティリティ関数
```

## OpenAPI (`openapi/`)

```
openapi/
├── openapi.yaml           # エントリポイント
├── components/
│   ├── enums/             # Enum 定義 YAML
│   ├── schemas/           # DTO スキーマ（ドメイン別）
│   ├── parameters.yaml
│   ├── requestBodies.yaml
│   ├── responses.yaml
│   └── securitySchemes.yaml
├── paths/                 # エンドポイント定義
├── schema/
│   └── fields.yaml        # フィールドメタデータ
├── scripts/               # コード生成スクリプト
│   ├── templates/         #   テンプレートファイル
│   ├── generate-php-enums.mjs
│   ├── generate-ts-enums.mjs
│   ├── generate-openapi-validators.mjs
│   └── generate-openapi-examples.mjs
├── build/                 # 自動生成（バンドル）
└── examples/              # 自動生成（サンプル JSON）
```

## 自動生成ファイルの判別

以下のディレクトリ配下は **手動編集禁止**：

- `back/app/__Generated__/`
- `back/app/Http/Requests/Generated/`
- `front/src/__generated__/`
- `openapi/build/`
- `openapi/examples/`
