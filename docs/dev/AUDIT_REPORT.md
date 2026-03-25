# 全面監査レポート — 勤怠管理システム

> **実施日**: 2025年  
> **対象**: バックエンド全コード / フロントエンド全コード / ドキュメント74ファイル / インフラ構成 / OpenAPI定義  
> **方針**: 既存の設計・コード・ドキュメントはすべて間違っている前提で精査

---

## 🔴 CRITICAL（即座に修正が必要）

### C-1: AuthService.php — AuthenticationException 未import

| 項目 | 内容 |
|---|---|
| **対象** | `back/app/Services/AuthService.php` L72 |
| **問題点** | `throw new AuthenticationException(...)` を使用しているが `use Illuminate\Auth\AuthenticationException;` が未宣言 |
| **なぜ問題か** | `refresh()` が呼ばれると PHP Fatal Error で 500 が返る。Handler の例外変換も通らない |
| **想定バグ** | JWT リフレッシュ失敗時に 401 ではなく 500 Internal Server Error |
| **修正方針** | `use Illuminate\Auth\AuthenticationException;` を追加 |

### C-2: AttendanceBreak モデル — UUID 自動生成なし

| 項目 | 内容 |
|---|---|
| **対象** | `back/app/Models/AttendanceBreak.php` |
| **問題点** | UUID の `booted()` フックがない。`$keyType = 'string'` / `$incrementing = false` だが ID の自動設定がない |
| **なぜ問題か** | `AttendanceBreak::create([...])` で ID が null のまま INSERT され DB エラー |
| **想定バグ** | 休憩開始時に 500 エラー |
| **修正方針** | `booted()` フックで `Str::uuid()` による ID 自動設定を追加 |

### C-3: フロントエンド enums.ts — テンプレート未展開

| 項目 | 内容 |
|---|---|
| **対象** | `front/src/__generated__/enums.ts` |
| **問題点** | `{{ name }}`, `{{ cases }}` のテンプレートプレースホルダーがそのまま残っている |
| **なぜ問題か** | TypeScript のコンパイルが不可能。`ClockAction`, `ClockStatus` 等の型が全て未定義 |
| **想定バグ** | フロントエンドのビルドが通らない |
| **修正方針** | `make openapi-enums` の生成スクリプトが正しくテンプレートを展開するよう修正 |

### C-4: DomainException のエラーコードがドキュメント間で不整合

| 項目 | 内容 |
|---|---|
| **対象** | `docs/dev/error-handling.md` / `back/app/Exceptions/Handler.php` |
| **問題点** | error-handling.md では DomainException の code を `DOMAIN_ERROR` と記載しているが、実装では DomainException 側で個別の errorCode（`OPEN_ATTENDANCE_EXISTS` 等）を設定できる |
| **なぜ問題か** | フロントエンドが固定の `DOMAIN_ERROR` を期待するとカスタムエラーコードの判定ができない |
| **想定バグ** | エラーコードによる条件分岐が機能しない |
| **修正方針** | error-handling.md にカスタムエラーコードの仕様を追記 |

---

## 🟠 HIGH（重大な設計問題・潜在バグ）

### H-1: PHP バージョン不整合（ドキュメント間）

| 項目 | 内容 |
|---|---|
| **対象** | `architecture-overview.md` vs `coding-rules-backend.md` |
| **問題点** | architecture-overview は「PHP 8.4」、coding-rules-backend は「PHP 8.2+」 |
| **修正方針** | 実際の Dockerfile の FROM を確認し、全ドキュメントのバージョンを統一 |

### H-2: Repository 層の虚偽記載

| 項目 | 内容 |
|---|---|
| **対象** | `architecture-overview.md` / `backend-architecture.md` |
| **問題点** | 「Controller → Service → Repository → Model」と記載されるが、実際は Service が Eloquent を直接使用。BaseRepository は定義のみで未使用 |
| **なぜ問題か** | 新規開発者が Repository を経由するコードを書き、不要な抽象化が増殖 |
| **修正方針** | アーキテクチャ図を「Controller → Service → Model（Eloquent 直接）」に修正。BaseRepository は削除を推奨 |

### H-3: API バージョニング方針の矛盾

| 項目 | 内容 |
|---|---|
| **対象** | `api-design-guide.md` / `api-versioning-strategy.md` |
| **問題点** | api-design-guide は「バージョニングしない」、api-versioning-strategy は URL ベースバージョニングを詳細設計 |
| **修正方針** | 現行が v1 未使用であれば api-versioning-strategy.md に「将来設計」と明記 |

### H-4: Auth の二重状態管理（React Query + Zustand）

| 項目 | 内容 |
|---|---|
| **対象** | `front/src/features/auth/hooks/useAuth.ts`, `front/src/app/AppRoutes.tsx` |
| **問題点** | React Query で認証状態を取得し、useEffect で Zustand に同期。AppRoutes は React Query を、LoginPage は Zustand を参照 |
| **なぜ問題か** | 同期遅延で認証状態不整合。初回レンダー時の一瞬のちらつき  |
| **修正方針** | Zustand を SSOT にして React Query を同期先にする |

### H-5: ErrorBoundary 未使用

| 項目 | 内容 |
|---|---|
| **対象** | フロントエンド全体 |
| **問題点** | `react-error-boundary` が依存に入っているが、コンポーネントツリーに `<ErrorBoundary>` がない |
| **なぜ問題か** | レンダー中の例外で全画面ホワイトアウト |
| **修正方針** | `App.tsx` または `AppProviders` に ErrorBoundary を追加 |

### H-6: ログイン失敗のユーザーフィードバック欠如

| 項目 | 内容 |
|---|---|
| **対象** | `front/src/features/auth/ui/LoginPage.tsx`, `front/src/lib/http/client.ts` |
| **問題点** | `mutateAsync` が throw → React Hook Form がキャッチ。グローバルエラーハンドラは 401 を `return` してトースト非表示 |
| **なぜ問題か** | ログイン失敗時に何のフィードバックもない |
| **修正方針** | LoginPage で catch してエラーメッセージを表示 |

### H-7: 既存テストが旧 DDD アーキテクチャを参照

| 項目 | 内容 |
|---|---|
| **対象** | `back/tests/` 配下の Controller/Command/Query テスト |
| **問題点** | `App\Infrastructure\Database\Models\UserModel`, `App\Application\User\Create\CreateUserCommand` など実在しないクラスを参照 |
| **なぜ問題か** | テストが全て失敗するため CI の信頼性ゼロ |
| **修正方針** | テストファイルを現行アーキテクチャに合わせて全面書き換え、または削除して新規作成 |

### H-8: JWT を localStorage に保存（XSS リスク）

| 項目 | 内容 |
|---|---|
| **対象** | `front/src/lib/http/client.ts` L27, `back/` のセッション設計 |
| **問題点** | XSS 攻撃で JWT が奪取可能 |
| **なぜ問題か** | セッションハイジャック、他ユーザーの勤怠操作 |
| **修正方針** | httpOnly + Secure + SameSite=Strict Cookie に移行（medium-term） |

### H-9: console.error に本番HTTPレスポンス全体を出力

| 項目 | 内容 |
|---|---|
| **対象** | `front/src/lib/http/client.ts` L199-205 |
| **問題点** | 環境判定なしでHTTPリクエスト/HTTPレスポンスデータを console.error に出力 |
| **なぜ問題か** | パスワードなどの機密情報が開発者ツールに露出 |
| **修正方針** | `import.meta.env.DEV` でガード |

### H-10: UserPolicy が空スケルトン

| 項目 | 内容 |
|---|---|
| **対象** | `back/app/Policies/UserPolicy.php` |
| **問題点** | 認可ロジックが未実装。管理者・一般ユーザーの権限チェックなし |
| **なぜ問題か** | 任意のユーザーが他人の勤怠を操作可能 |
| **修正方針** | 少なくとも `update`, `delete` に所有者チェックを実装 |

---

## 🟡 MEDIUM（設計改善・保守性問題）

### M-1: Seeder の冪等性なし
- **対象**: `back/database/seeders/` 全シーダー
- `php artisan db:seed` を2回実行するとデータ重複
- `firstOrCreate` または `truncate` を使用すべき

### M-2: 楽観的ロック未実装
- **対象**: `back/app/Services/AttendanceService.php` `clockIn()`
- 同時HTTPリクエストで二重出勤レコード作成の可能性
- SELECT → INSERT の間にレースコンディション

### M-3: PrivateLayout のハードコードユーザー
- **対象**: `front/src/shared/components/layouts/PrivateLayout.tsx` L11-15
- `const user = { name: "TODO", email: "taro@example.com" }` が固定値
- ログインユーザーを使用する。

### M-4: 休憩機能が未実装
- **対象**: `front/src/features/attendance/hooks/useAttendanceClock.ts`
- 休憩ボタンは表示されるが `sonner.info('この操作はまだ実装されていません')` を返すのみ
- 実装する。

### M-5: totalWorkedMs（分なのにミリ秒命名）
- **対象**: `front/src/features/attendance/ui/types.ts`
- `totalWorkedMs` に `calculateWorkedMinutes()`（分）の結果が代入される
- 修正する。

### M-6: Dashboard の N+1 select パターン
- **対象**: `front/src/features/dashboard/hooks/useDashboardQueries.ts`
- 3つの `useQuery` で同じ queryFn+select が各レンダーで3回実行

### M-7: ErrorModal のアクセシビリティ不備
- ESC キー、フォーカストラップ、`role="dialog"`、バックドロップクリックなし

### M-8: 本番 sourcemap が有効
- **対象**: `front/vite.config.ts`
- ソースコードが本番で閲覧可能

### M-9: Vite 8 Beta を本番依存に使用
- **対象**: `front/package.json`
- `"vite": "^8.0.0-beta.13"` — 安定版リリース前

### M-10: 定数の重複定義
- `DAYS_OF_WEEK`, `DAY_INDEX_MAP` が `shared/constants/date.ts` と `MiniCalendar.tsx` に重複

### M-11: Dead Code
- `TeamEmptyState.tsx` — エクスポートされるが未使用
- `useGetTeamMembers` — `useTeam` 内で再定義・未使用
- `tokens.ts` — CVA variants がインラインでクラスを指定し tokens 未参照

---

## 🔵 DOCUMENTATION ISSUES（ドキュメント固有の問題）

### D-1: デザインシステム3重重複
- `design-system.md` / `style.md` / `tailwind-cva-patterns.md` が同じ内容を異なる粒度で記述
- **修正方針**: 1ファイルに統合、または明確な役割分担を定義

### D-2: レガシーカラムが複数ドキュメントに残存
- `extends BaseModel` / `clock_out_at` が `clock_in_at` / `clock_out_at` に移行済みだが、一部ドキュメントが旧カラムを参照

### D-3: 未実装機能を設計済みとして記述
以下の機能は設計ドキュメントがあるが未実装:
- フロントエンドテスト（Vitest）
- 監視・アラート（CloudWatch, Prometheus, Grafana）
- WebSocket リアルタイム通知
- JWT 自動リフレッシュ
- Nginx セキュリティヘッダー
- CI/CD 自動デプロイ
- E2E テスト
- DR 環境
- 依存パッケージ監査 CI
- 時間単位有給
- 自動休憩付与
→ 各ドキュメントに「設計済み・未実装」を明記すべき

### D-4: Orval バージョン矛盾
- `package.json` に `orval: ^6.0.0` と `@orval/core: ^8.5.1` が混在

### D-5: `index.html` の lang 属性
- `<html lang="en">` だが UIは全て日本語 → `lang="ja"` にすべき

---

## ✅ 良い設計・維持すべき点

| 項目 | 根拠 |
|---|---|
| OpenAPI SSOT パイプライン | 型の一貫性が保証される |
| BaseService の transaction() | コミット後ログという正しい設計 |
| DomainException の分離 | ビジネスルールとHTTPの責務分離 |
| Feature-based フロントエンド構成 | 機能単位の凝集度が高い |
| Mapper パターン（toAttendanceView） | API HTTPレスポンスと UI 表示の分離 |
| CVA ベースのデザインシステム | 型安全なスタイル管理 |
| 日跨ぎシフトの設計 | work_date + clock_in_at + clock_out_at + work_timezone で完全対応 |
| immutable_datetime キャスト | 副作用のない日時操作 |
