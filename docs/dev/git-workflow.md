# Git ワークフロー

## ブランチ戦略

### ブランチ命名規則

| 種別 | パターン | 例 |
|---|---|---|
| 機能追加 | `feature/{簡潔な説明}` | `feature/team-management` |
| バグ修正 | `fix/{簡潔な説明}` | `fix/clock-in-timezone` |
| リファクタリング | `refactor/{簡潔な説明}` | `refactor/service-layer` |
| ドキュメント | `docs/{簡潔な説明}` | `docs/api-guide` |
| 緊急修正 | `hotfix/{簡潔な説明}` | `hotfix/login-error` |

### ブランチフロー

```
main（本番）
  ↑
  └── feature/xxx → PR → レビュー → マージ
```

## コミットメッセージ

### フォーマット

```
{type}: {概要}

{詳細（任意）}
```

### Type 一覧

| type | 用途 |
|---|---|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング（機能変更なし） |
| `docs` | ドキュメント変更 |
| `style` | コードスタイル（空白、フォーマット等） |
| `test` | テストの追加・修正 |
| `chore` | ビルド、CI、依存関係等 |
| `perf` | パフォーマンス改善 |

### 例

```
feat: チーム管理画面のメンバー一覧を実装

- TeamMemberStatus Enum を追加
- GET /api/teams/{id}/members エンドポイントを実装
- メンバーカードコンポーネントを作成
```

## Pull Request

### PR テンプレート

```markdown
## 概要
{何を変更したか}

## 変更内容
- [ ] {変更点 1}
- [ ] {変更点 2}

## テスト
- [ ] テスト追加 / 更新
- [ ] ローカルで動作確認済み

## スクリーンショット（UI 変更がある場合）
```

### CI チェック

PR 作成時に以下が自動実行される:
- OpenAPI Lint
- 自動生成コードの Drift チェック

### マージルール

- `main` への直接 push は禁止
- CI チェックをすべてパスすること
- Squash マージを推奨（コミット履歴をきれいに保つ）

## `.gitignore` に含まれるもの

- `vendor/`（Composer 依存 — `composer install` で復元）
- `node_modules/`（npm 依存 — `pnpm install` で復元）
- `.env`（環境変数 — `.env.example` からコピー）
- `openapi/build/`（自動生成バンドル）
- `openapi/examples/`（自動生成サンプル）

> **注意**: `__generated__/` / `__Generated__/` 配下の自動生成ファイルは **Git にコミットする**。CI でdrift チェックするため。
