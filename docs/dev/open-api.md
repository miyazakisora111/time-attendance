# OpenAPI 設計ガイド — 勤怠管理システム

## 1. 概要

### OpenAPI の目的

本プロジェクトでは OpenAPI 3.0.3 仕様を **「型の単一ソース（Single Source of Truth）」** として位置付けています。

- フロントエンド（React + TypeScript）の型・API クライアント・バリデーションを自動生成
- バックエンド（Laravel）の FormRequest / Resource と 1:1 で対応
- PR レビュー時の仕様変更検知

### このドキュメントの役割

新規メンバーが OpenAPI 定義を **読む・書く・変更する** ときに迷わないようにするためのガイドです。
設計思想・命名規則・変更手順をすべて記載しています。

---

## 2. ディレクトリ構成

```
openapi/
├── openapi.yaml                     # エントリポイント（パス・コンポーネント登録）
├── components/
│   ├── enums/                       # Enum 定義（全ドメイン共通）
│   │   ├── ClockAction.yaml         #   打刻アクション: in, out, break_start, break_end
│   │   ├── ClockStatus.yaml         #   打刻状態: out, in, break
│   │   ├── ThemeType.yaml           #   UIテーマ: light, dark
│   │   ├── LanguageCode.yaml        #   言語コード: ja, en
│   │   ├── CalendarDayStatus.yaml   #   カレンダー日状態: working, off, holiday, pending
│   │   ├── TeamMemberStatus.yaml    #   メンバー状態: working, break, off, leave
│   │   └── AttendanceStatus.yaml  # 勤務区分: 通常, 残業, 休日
│   ├── parameters.yaml              # 再利用可能なパラメータ定義
│   ├── requestBodies.yaml           # HTTPリクエストボディ定義（スキーマへの参照）
│   ├── responses.yaml               # エラーHTTPレスポンス定義
│   ├── securitySchemes.yaml         # JWT Bearer 認証
│   └── schemas/                     # Data 定義（ドメイン別）
│       ├── attendance/              #   勤怠ドメイン
│       ├── auth/                    #   認証ドメイン
│       ├── dashboard/               #   ダッシュボードドメイン
│       ├── schedule/                #   スケジュールドメイン
│       ├── settings/                #   設定ドメイン
│       ├── team/                    #   チームドメイン
│       └── common/                  #   共通エラースキーマ
├── paths/                           # エンドポイント定義（ドメイン別）
│   ├── auth.yaml
│   ├── attendance.yaml
│   ├── dashboard.yaml
│   ├── schedule.yaml
│   ├── settings.yaml
│   └── team.yaml
├── schema/
│   └── fields.yaml                  # フィールドメタデータ（UI生成・バリデーション用）
├── examples/                        # 自動生成されるHTTPリクエスト/HTTPレスポンス例
└── build/                           # 自動生成されるバンドル（bundle.yaml / bundle.json）
```

### 各ディレクトリの責務

| ディレクトリ | 責務 | 編集頻度 |
|---|---|---|
| `components/enums/` | 全ての列挙型を一元管理 | 低（値追加時のみ） |
| `components/schemas/` | Data（データ構造）をドメイン別に格納 | 中 |
| `components/parameters.yaml` | 再利用可能なパス・クエリパラメータ | 低 |
| `components/requestBodies.yaml` | HTTPリクエストボディのラッパー定義 | 低 |
| `components/responses.yaml` | 共通エラーHTTPレスポンス（401, 403, 404, 409, 422, 500） | 低 |
| `paths/` | API エンドポイント定義 | 高 |
| `schema/fields.yaml` | UI生成用フィールドメタデータ | 中 |
| `build/` | **自動生成** — 手動編集禁止 | — |
| `examples/` | **自動生成** — 手動編集禁止 | — |

---

## 3. 設計思想

### なぜ分離しているのか

| 分離対象 | 理由 |
|---|---|
| **Enum** | 同一 enum が複数スキーマで参照される。1箇所で管理することで不整合を防ぐ |
| **Schema（Data）** | ドメインごとに閉じた構造を持つ。ファイル単位の変更差分で影響範囲が明確 |
| **Parameters** | `from`/`to`（日付範囲）や `year`/`month` は複数エンドポイントで同じ意味で使用 |
| **RequestBody** | スキーマとHTTP層の関心を分離。Content-Type 変更時に吸収しやすい |
| **Error Response** | 全エンドポイント共通のエラーフォーマットを1箇所で定義 |

### なぜ共通化しているのか

共通化の目的は **「同じ意味のものを別々に定義しない」** ことです。

- `ThemeType` enum → `SettingsResponse` と `UpdateSettingsRequest` の両方で使用
- `SettingsNotifications` → HTTPレスポンスとHTTPリクエストで同一スキーマを共有
- `ErrorResponse` → 全エラーHTTPレスポンスの統一フォーマット

### ドメイン設計との関係

```
ドメインモデル        OpenAPI Schema         Laravel
───────────         ──────────────         ──────────
勤怠（Attendance）  → AttendanceResponse    → AttendanceResource
打刻（Clock）       → DashboardClockRequest → ClockRequest (FormRequest)
設定（Settings）    → SettingsResponse      → SettingsResource
```

OpenAPI のスキーマ名は **ドメイン用語 + 役割サフィックス** で構成し、
バックエンド・フロントエンドの対応物が自然に推測できるようにします。

---

## 4. 分離ルール

### Enum

- **全ての enum は `components/enums/` に独立ファイルとして配置**
- スキーマ内でのインライン `enum` 定義は禁止
- ファイル名 = 型名（例: `ClockAction.yaml` → `ClockAction`）
- `$ref` で参照する

```yaml
# ✅ 正しい（$ref で参照）
status:
  $ref: "../../enums/ClockStatus.yaml#/ClockStatus"

# ❌ 禁止（インライン enum）
status:
  type: string
  enum: [out, in, break]
```

### Schema（Data）

- ドメインごとのサブディレクトリに配置: `schemas/{domain}/`
- 1ファイル = 1スキーマ（例外: 密接に関連する小さいスキーマは同居可能）
- インラインオブジェクト定義は禁止。ネストされた object は別ファイルに抽出
- `additionalProperties` は原則禁止（バリデーションエラー用 `errors` フィールドのみ例外）

```yaml
# ✅ 正しい（$ref で外部参照）
stats:
  $ref: "./DashboardStats.yaml#/DashboardStats"

# ❌ 禁止（インラインオブジェクト）
stats:
  type: object
  properties:
    totalHours:
      type: number
```

### Request / Response

- HTTPリクエストスキーマのサフィックス: `*Request`
- HTTPレスポンススキーマのサフィックス: `*Response`
- paths からは `requestBodies.yaml` 経由で参照
- 同一ドメインの Request と Response は同じディレクトリに配置

### Parameter

- 再利用されるパラメータは `components/parameters.yaml` に定義
- paths では `$ref` で参照
- パラメータ名の命名規則:
  - パスパラメータ: `Path{Resource}Id`（例: `PathAttendanceId`）
  - クエリパラメータ: `Query{名前}`（例: `QueryDateFrom`）

---

## 5. 共通化ルール

### 何を共通化するか

| 対象 | 共通化先 | 理由 |
|---|---|---|
| Enum（全て） | `components/enums/` | 値の追加・変更を1箇所に集約 |
| ID（UUID） | 各スキーマ内 `type: string, format: uuid` | 意味的に統一 |
| 日付 / 時間 | パラメータ定義で共通化 | `from`/`to` パターンの再利用 |
| エラーフォーマット | `ErrorResponse` / `ValidationErrorResponse` | 全エンドポイント共通 |
| エラーHTTPレスポンス | `components/responses.yaml` | 401/403/404/409/422/500 |
| 通知設定 | `SettingsNotifications` | Request/Response で同一構造 |

### 共通化の判断基準

以下 **全てを満たす** 場合に共通化する:

1. **3箇所以上**で使用される（または2箇所でも将来的な拡張が確実）
2. **意味が同一**である（同じフィールド名・同じバリデーション）
3. **将来も安定**している（頻繁に分岐しない）

判断に迷う場合は **まず重複を許容し、3箇所目が出現した時点** で共通化する。

---

## 6. 命名規則

### Schema 命名

```
{ドメイン}{サブドメイン?}{役割}
```

| パターン | 例 | 説明 |
|---|---|---|
| `{Domain}Response` | `DashboardResponse` | API HTTPレスポンス全体 |
| `{Domain}{Sub}Request` | `AttendanceClockInRequest` | HTTPリクエストボディ |
| `{Domain}{Sub}` | `DashboardStats` | HTTPレスポンス内の部品Data |
| `Update{Domain}Request` | `UpdateSettingsRequest` | 更新HTTPリクエスト |

### Enum 命名

| パターン | 例 |
|---|---|
| `{名詞}{Type\|Status\|Code}` | `ClockStatus`, `ThemeType`, `LanguageCode` |
| ドメイン固有の状態 | `CalendarDayStatus`, `TeamMemberStatus` |

### Response 命名

| パターン | 用途 |
|---|---|
| `{Domain}Response` | 単一リソースのHTTPレスポンス |
| `{Domain}MembersResponse` | 一覧HTTPレスポンス |
| `ErrorResponse` | 共通エラー |
| `ValidationErrorResponse` | バリデーションエラー |

---

## 7. 変更時のルール

### Enum 追加時の手順

1. `components/enums/` に新しい YAML ファイルを作成
2. `openapi.yaml` の `components.schemas` セクションに `$ref` を追加
3. 使用するスキーマから `$ref` で参照
4. `make openapi` を実行してバンドル再生成
5. フロントの型が更新されたことを確認

**既存 enum に値を追加する場合:**

1. enum ファイルの値リストに追加
2. `make openapi` を実行
3. **⚠️ Breaking Change 注意:** フロントの switch/case や型ガードが新しい値を処理できるか確認

### Schema 変更時の影響範囲

| 変更内容 | 影響範囲 |
|---|---|
| プロパティ追加（optional） | フロント: 型に追加されるが既存コードは動く |
| プロパティ追加（required） | **⚠️ Breaking:** フロントの既存コードが壊れる可能性 |
| プロパティ削除 | **⚠️ Breaking:** フロントで使用している箇所がエラーになる |
| Enum 値の追加 | フロント: exhaustive check がエラーになる可能性 |
| 型の変更 | **⚠️ Breaking:** フロント・バックエンド両方に影響 |

### Breaking Change の考え方

**フロント型生成に影響する変更は全て Breaking Change** として扱う:

1. PR 説明に「OpenAPI Breaking Change」ラベルを付ける
2. バックエンドの API バージョニングまたは後方互換対応を検討
3. フロント担当者にレビューを依頼

---

## 8. フロント連携

### 型生成の流れ

```
openapi.yaml
    ↓  make openapi-lint（構文検証）
    ↓  make openapi-bundle（$ref 解決 → bundle.yaml/json）
    ↓
    ├── make openapi-client（Orval → React Query hooks + TypeScript 型）
    ├── make openapi-zod（Zod バリデーションスキーマ）
    ├── make openapi-validators（カスタムバリデーション）
    └── make openapi-examples（サンプル JSON）
```

**一括実行:**

```bash
make openapi        # 上記すべてを実行
make openapi-clean  # 生成物をクリーン → 再生成
```

### 生成されるファイル

| ツール | 出力先 | 内容 |
|---|---|---|
| Orval | `front/src/__generated__/` | React Query hooks, Axios クライアント |
| Orval | `front/src/__generated__/model/` | TypeScript 型定義 |
| openapi-zod | `front/src/__generated__/zod.ts` | Zod スキーマ |
| validators | `front/src/__generated__/zod.validation.ts` | カスタムバリデーション |

### フロントでの使い方

```typescript
// 自動生成された React Query hook を使用
import { useGetDashboardApi } from '@/__generated__';

// 自動生成された型を使用
import type { DashboardResponse, ClockStatus } from '@/__generated__/model';

function Dashboard() {
  const { data } = useGetDashboardApi();
  // data は DashboardResponse 型として推論される
}
```

---

## 9. バックエンド連携

### Laravel との対応

| OpenAPI | Laravel | ファイル配置 |
|---|---|---|
| `*Request` スキーマ | `FormRequest` | `app/Http/Requests/` |
| `*Response` スキーマ | `Resource` / `JsonResource` | `app/Http/Resources/` |
| Enum | `App\Enums\*` | `app/Enums/` |
| パスパラメータ | Route Model Binding | `routes/api.php` |
| バリデーションルール | `FormRequest::rules()` | `app/Http/Requests/` |

### 対応例

```
OpenAPI                        → Laravel
──────────────────────────────────────────────────────
AttendanceClockInRequest       → ClockInRequest extends FormRequest
AttendanceResponse             → AttendanceResource extends JsonResource
ClockAction enum               → App\Enums\ClockAction (backed enum)
ErrorResponse                  → App\Exceptions\Handler (render)
ValidationErrorResponse        → 自動（Laravel のバリデーション例外）
```

### スキーマ追加時のバックエンド作業

1. OpenAPI でスキーマを定義
2. 対応する FormRequest を作成（プロパティとルールを一致させる）
3. 対応する Resource を作成（HTTPレスポンス構造を一致させる）
4. テストでHTTPレスポンス構造を検証

---

## 10. よくあるミス

### ❌ Enum をインラインで書く

```yaml
# ❌ これは禁止
status:
  type: string
  enum: [working, break, off]
```

→ `components/enums/` に定義して `$ref` で参照する

### ❌ Schema をコピペする

`SettingsNotifications` のようにHTTPリクエストとHTTPレスポンスで同一構造を持つ場合、
コピペせず同一ファイルを `$ref` で参照する。

### ❌ 命名が曖昧

```yaml
# ❌ 何のデータか分からない
Data:
  type: object

# ✅ ドメイン + 役割が明確
DashboardStats:
  type: object
```

### ❌ インラインオブジェクト定義

```yaml
# ❌ ネストオブジェクトをインラインで定義
user:
  type: object
  properties:
    id:
      type: string

# ✅ 別ファイルに抽出して参照
user:
  $ref: "./DashboardUser.yaml#/DashboardUser"
```

### ❌ `build/` や `examples/` を手動編集

これらは自動生成されるため、直接編集しても `make openapi` で上書きされます。
必ずソースファイル（`components/`, `paths/`）を編集してください。

### ❌ `additionalProperties` の使用

特定のプロパティを持つオブジェクト型は明示的にプロパティを定義する。
`additionalProperties: true` は型安全性を損なうため原則禁止。

---

## 11. ベストプラクティス

### 実務での運用方法

1. **API 設計は OpenAPI ファーストで行う**
   - 実装前に OpenAPI でスキーマを定義 → `make openapi` → フロント・バックが並行開発

2. **変更は常に OpenAPI から開始**
   - OpenAPI を変更 → `make openapi` → 生成された型に合わせて実装を修正

3. **CI で lint を実行**
   - `make openapi-lint` を CI に組み込み、構文エラーを早期検出

4. **バンドルファイルをコミットしない**
   - `build/` と `examples/` は `.gitignore` 対象。各開発者が `make openapi` で生成

### PR レビュー観点

| チェック項目 | 確認内容 |
|---|---|
| Enum の配置 | `components/enums/` に配置されているか |
| インライン定義 | 新しいインラインオブジェクトや enum が追加されていないか |
| 命名規則 | `{Domain}{Role}` のパターンに従っているか |
| `$ref` の使用 | 重複定義せず `$ref` で参照しているか |
| Breaking Change | required プロパティの追加・削除、型変更がないか |
| nullable の明示 | null を返す可能性があるフィールドに `nullable: true` が付いているか |
| 影響範囲の記載 | PR 説明にフロント/バックへの影響が記載されているか |

### 新しいエンドポイントを追加する手順

1. `paths/{domain}.yaml` にエンドポイントを追加
2. 必要なスキーマを `components/schemas/{domain}/` に作成
3. 新しい enum があれば `components/enums/` に作成
4. HTTPリクエストボディがあれば `components/requestBodies.yaml` に追加
5. 新しいパラメータがあれば `components/parameters.yaml` に追加
6. `openapi.yaml` に path と schema の `$ref` を登録
7. `make openapi` を実行して型生成
8. 生成された型・hooks を使ってフロント・バックを実装
