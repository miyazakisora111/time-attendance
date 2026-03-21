# 命名規則まとめ

## ファイル・ディレクトリ

| 対象 | 規則 | 例 |
|---|---|---|
| React コンポーネント `.tsx` | PascalCase | `LoginPage.tsx`, `Button.tsx` |
| TypeScript ユーティリティ `.ts` | kebab-case | `api-error.ts`, `query-client.ts` |
| PHP クラス | PascalCase | `AttendanceService.php` |
| マイグレーション | snake_case + タイムスタンプ | `2024_01_01_000000_create_users_table.php` |
| テスト | PascalCase + `Test` サフィックス | `AttendanceServiceTest.php` |
| OpenAPI YAML | PascalCase（Enum）/ kebab-case（paths） | `ClockAction.yaml`, `attendance.yaml` |
| ドキュメント | kebab-case | `getting-started.md` |
| ディレクトリ | kebab-case（FE）/ PascalCase（PHP namespace） | `design-system/`, `Services/` |

## PHP（バックエンド）

| 対象 | 規則 | 例 |
|---|---|---|
| クラス名 | PascalCase | `AttendanceService` |
| メソッド名 | camelCase | `clockIn()`, `getUser()` |
| プロパティ | camelCase | `$userId`, `$isActive` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Enum case | UPPER_SNAKE_CASE | `BREAK_START`, `IN` |
| 名前空間 | PascalCase | `App\Services\AttendanceService` |
| トレイト | PascalCase, 形容詞的 | `HasUuid`, `AuthenticatedUser` |
| インターフェース | PascalCase | `RepositoryInterface` |

## TypeScript（フロントエンド）

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネント名 | PascalCase | `AttendancePage` |
| フック | camelCase, `use` プレフィクス | `useAuth()`, `useCurrentTime()` |
| 関数名 | camelCase | `formatMinutesToTime()` |
| 変数名 | camelCase | `isAuthenticated`, `userData` |
| 定数 | UPPER_SNAKE_CASE | `API_TIMEOUT`, `MAX_RETRY` |
| 型 / interface | PascalCase | `AuthUser`, `ApiError` |
| Enum（const array） | PascalCase | `ClockAction`, `ThemeType` |

## データベース

| 対象 | 規則 | 例 |
|---|---|---|
| テーブル名 | snake_case, 複数形 | `users`, `attendance_records` |
| カラム名 | snake_case | `first_name`, `clocked_in_at` |
| 外部キー | `{単数テーブル}_id` | `user_id`, `team_id` |
| 日時カラム | `{動詞}_at` | `created_at`, `approved_at` |
| 真偽値カラム | `is_{形容詞}` | `is_active`, `is_approved` |
| インデックス | `idx_{テーブル}_{カラム}` | `idx_users_department_id` |
| ユニーク制約 | `uq_{テーブル}_{カラム}` | `uq_attendances_user_date` |

## API

| 対象 | 規則 | 例 |
|---|---|---|
| URL パス | kebab-case, 複数形 | `/attendance-records` |
| クエリパラメータ | snake_case | `?page=1&per_page=15` |
| リクエストボディ | snake_case | `{ "first_name": "太郎" }` |
| レスポンスフィールド | snake_case | `{ "user_id": "..." }` |
| エラーコード | UPPER_SNAKE_CASE | `VALIDATION_ERROR` |
| operationId | camelCase | `loginApi`, `getAttendanceRecords` |

## CSS / デザイン

| 対象 | 規則 | 例 |
|---|---|---|
| CVA variant 名 | camelCase | `variant`, `fullWidth` |
| intent 値 | lowercase | `primary`, `danger` |
| デザイントークン | camelCase | `colors.primary`, `spacing.md` |
