# バックエンド コーディング規約

## PHP 全般

- PHP 8.4 の機能を積極的に利用する（Dockerfile は `php:8.4-fpm-bookworm`）
- `declare(strict_types=1);` を全ファイルの先頭に記述する
- 型宣言は必須。戻り値型・引数型・プロパティ型すべて明示する
- `readonly` プロパティを積極的に使う
- PSR-12 準拠。`phpcs.xml` でチェックする

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| クラス | PascalCase | `AttendanceService` |
| メソッド | camelCase | `clockIn()` |
| プロパティ | camelCase | `$userId` |
| 定数 | UPPER_SNAKE | `MAX_BREAK_MINUTES` |
| DB カラム | snake_case | `clock_in_at` |
| ルート | kebab-case | `/attendance-records` |
| Enum case | UPPER_SNAKE | `BREAK_START` |

## Controller

- 1 アクション = 1 メソッドを目安にする
- ビジネスロジックは **絶対に書かない**。Service に委譲する
- コンストラクタインジェクションで Service を注入する
- 認証ユーザーは `$this->resolveAuthUser()` で取得する（`auth()->user()` 禁止）
- HTTPレスポンスは `ApiResponse::success()` / `ApiResponse::error()` を使う

```php
public function store(ClockRequest $request): JsonResponse
{
    $result = $this->attendanceService->clockIn($this->resolveAuthUser());
    return ApiResponse::success($result, '出勤を記録しました');
}
```

## Service

- `BaseService` を継承する
- メソッド名は **動詞始まり**: `clockIn()`, `getUser()`, `updateSettings()`
- ビジネスルール違反は `DomainException`（`App\Exceptions\DomainException`）を投げる
  - PHP 標準の `\DomainException` は使わないこと
- 副作用のある処理は `$this->transaction()` でラップする（`DB::transaction()` 直接呼び出し禁止）
- ログは `$this->log()` / `$this->logWarning()` / `$this->logError()` を使う
- タイムゾーン解決は `$this->resolveTimezone()` を使う（ハードコード禁止）
- 曜日表示は `$this->weekdayJa()` を使う
- 勤務時間計算は `$this->calculateWorkHours()` を使う

### BaseService 提供メソッド一覧

| メソッド | 用途 |
|---|---|
| `log($message, $context)` | INFO ログ記録 |
| `logWarning($message, $context)` | WARNING ログ記録 |
| `logError($message, $context)` | ERROR ログ記録 |
| `transaction($callback)` | トランザクション実行（コミット後ログ） |
| `resolveTimezone($timezone)` | null/空文字 → `DEFAULT_TIMEZONE` 解決 |
| `weekdayJa($date)` | Carbon → 「日」〜「土」 |
| `calculateWorkHours($startAt, $endAt, $workedMinutes, $fallbackEndTime)` | 勤務時間(時間)算出 |

## Model

- UUID 主キーを使う（`booted()` フックで自動生成）
- 日付は `immutable_datetime` / `immutable_date` でキャストする
- `$fillable` を明示する（`$guarded = []` は使わない）
- スコープは `scope` プレフィクスをつける: `scopeActive()`, `scopeMonth()`
- ドメインに密接なメソッドはモデルに置いてよい: `isClockedIn()`, `calculateWorkedMinutes()`

## DTO / ValueObject

- DTO は `BaseDTO` を継承し、`readonly` コンストラクタプロモーションを使う
- ValueObject は `BaseValueObject` を継承し、`assert()` で妥当性検証を行う
- ValueObject のバリデーション失敗は `App\Exceptions\DomainException` を使う

## 例外

- ドメインエラー → `App\Exceptions\DomainException`（400）
- バリデーションエラー → FormRequest が自動処理（422）
- 認証エラー → `AuthenticationException`（401）
- 認可エラー → `AuthorizationException`（403）

## バリデーション

- FormRequest は `BaseRequest` を継承する
- ルールは OpenAPI 定義から `OpenApiGeneratedRules::schema()` で自動取得する
- 追加ルールが必要な場合のみ `rules()` をオーバーライドする
- `$schemaName` プロパティに OpenAPI スキーマ名を設定する
- 数値・真偽値フィールドは `$filters` で正規化する（全角→半角変換含む）

## テスト

- `TestCase` を継承する
- `@test` アノテーションを使用する
- テスト名は `it_` で始める: `it_returns_authenticated_user()`
- 認証が必要なテストは `AuthenticatedUser` トレイトを使う
