# コード自動生成パイプライン

## 概要

OpenAPI 定義から複数の成果物を自動生成し、型安全性を保証する。

## 生成物一覧

| 成果物 | 生成元 | 出力先 | Make ターゲット |
|---|---|---|---|
| PHP Enum | `openapi/components/enums/*.yaml` | `back/app/__Generated__/Enums/` | `openapi-enums` |
| TypeScript Enum | `openapi/components/enums/*.yaml` | `front/src/__generated__/enums.ts` | `openapi-enums` |
| OpenAPI バンドル | `openapi/openapi.yaml` | `openapi/build/` | `openapi-bundle` |
| Zod スキーマ | `openapi/build/bundle.yaml` | `front/src/__generated__/zod.ts` | `openapi-zod` |
| API クライアント | `openapi/build/bundle.yaml` | `front/src/__generated__/` | `openapi-client` |
| Zod バリデーション | `openapi/build/bundle.json` | `front/src/__generated__/zod.validation.ts` | `openapi-validators` |
| Laravel ルール | `openapi/build/bundle.json` | `back/app/Http/Requests/Generated/` | `openapi-validators` |
| フィールドラベル | `openapi/build/bundle.json` | `front/src/__generated__/field-labels.json` | `openapi-validators` |
| サンプル JSON | `openapi/build/bundle.json` | `openapi/examples/` | `openapi-examples` |

## 実行順序

```bash
make openapi
```

以下の順序で実行される:

```
1. openapi-enums     — PHP/TS Enum 生成
2. openapi-zod       — Zod スキーマ生成（bundle 依存）
3. openapi-client    — API クライアント生成
4. openapi-validators — バリデーションルール生成
5. openapi-examples  — サンプル JSON 生成
```

## スクリプト構成

```
openapi/scripts/
├── templates/                          # テンプレートファイル
│   ├── render.mjs                      #   テンプレートエンジン
│   ├── ts-enum-template.ts             #   TS Enum テンプレート
│   ├── ts-enum-header-template.ts      #   TS Enum ヘッダー
│   ├── php-enum-template.tpl.php       #   PHP Enum テンプレート
│   ├── zod-validation-template.ts      #   Zod バリデーション
│   └── laravel-validation-template.php #   Laravel バリデーション
├── generate-php-enums.mjs
├── generate-ts-enums.mjs
├── generate-openapi-validators.mjs
└── generate-openapi-examples.mjs
```

## テンプレートエンジン

`openapi/scripts/templates/render.mjs` は `{{key}}` プレースホルダーを変数で置換する簡易テンプレートエンジン。

```javascript
import { render } from './templates/render.mjs';

const output = await render('ts-enum-template.ts', {
  name: 'ClockAction',
  description: '打刻アクション',
  cases: "  'in',\n  'out',",
});
```

## CI での Drift チェック

`.github/workflows/openapi-check.yml` で以下を自動チェックする:

1. OpenAPI Lint（Redocly）
2. Enum 生成 → `git diff --exit-code` で差分チェック
3. バリデーションルール生成 → `git diff --exit-code` で差分チェック

生成コードが最新でない場合、CI が失敗する。

## 開発フロー

```
1. openapi/ 配下の YAML を編集
2. make openapi を実行
3. 生成されたファイルの変更を git add でコミットに含める
4. PR の CI で drift チェックが通ることを確認
```

## ⚠️ 注意事項

- `__generated__/` や `__Generated__/` 配下のファイルは **絶対に手動編集しない**
- テンプレートの変更は `openapi/scripts/templates/` 配下のファイルを編集する
- 新しい Enum を追加するには `openapi/components/enums/` に YAML ファイルを追加し、`make openapi-enums` を実行する
