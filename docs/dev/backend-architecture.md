# バックエンドアーキテクチャ

## 1. レイヤー構成図

```
HTTP Request
  ↓
Middleware (LogApiRequest, SetJsonContentType)
  ↓
Controller (BaseController — 薄いハンドラー)
  ↓
FormRequest (BaseRequest — OpenAPI 自動生成バリデーション)
  ↓
Service (BaseService — ビジネスロジック + トランザクション管理)
  ├── DTO / ValueObject (型安全なデータ受け渡し)
  └── Model (Eloquent — スコープ・ドメイン判定)
  ↓
ApiResponse::success() / ApiResponse::error()
```

## 2. 各レイヤーの責務表

| レイヤー | 責務 | やっていいこと | やってはいけないこと |
|---|---|---|---|
| **Controller** | リクエスト受付・Service 呼び出し・レスポンス返却 | `resolveUser()` で認証ユーザー取得、`ApiResponse` 返却 | ビジネスロジック、DB クエリ、条件分岐 |
| **FormRequest** | 入力バリデーション・型正規化 | OpenAPI ルール参照、`filterNumber()` / `filterBoolean()` | DB アクセス、ビジネスルール判定 |
| **Service** | ビジネスルール・ドメインロジック・トランザクション管理 | `transaction()` / `log()` / `logError()` / `resolveTimezone()` | 直接レスポンスを返す、Request / Response に依存する |
| **DTO** | レイヤー間の型安全なデータ受け渡し | `fromArray()` / `toArray()` 変換、ValueObject 保持 | DB アクセス、ビジネスロジック |
| **ValueObject** | 値の妥当性保証・不変性 | コンストラクタで `assert()`、`equals()` 比較 | 状態変更、外部副作用 |
| **Model** | テーブル定義・リレーション・スコープ・ドメイン判定 | キャスト、スコープ、`isClockedIn()` 等の判定メソッド | HTTP 関連の処理、トランザクション管理 |

## 3. BaseController

全コントローラーは `BaseController` を継承する。`UserService` 経由で認証ユーザーを取得し、未認証時は `AuthenticationException` がスローされる。

```php
abstract class BaseController extends Controller
{
    /**
     * 認証済みユーザーを解決する。
     * 未認証の場合は AuthenticationException がスローされる。
     */
    protected function resolveUser(): User
    {
        return app(UserService::class)->getAuthUser();
    }
}
```

### Controller 実装例

```php
final class AttendanceController extends BaseController
{
    public function __construct(
        private readonly AttendanceService $attendanceService,
    ) {}

    public function store(ClockRequest $request): JsonResponse
    {
        $result = $this->attendanceService->clockIn($this->resolveUser());
        return ApiResponse::success($result, '出勤を記録しました');
    }
}
```

> **落とし穴**: Controller に `if` 分岐やループを書き始めたら Service への切り出しを検討する。

## 4. BaseService

全サービスは `BaseService` を継承する。ログ・トランザクション・共通ユーティリティを一元提供する。

```php
abstract class BaseService
{
    /** アプリケーション既定タイムゾーン */
    protected const DEFAULT_TIMEZONE = 'Asia/Tokyo';

    // ── ログ ──────────────────────────────────────
    protected function log(string $message, array $context = []): void;
    protected function logWarning(string $message, array $context = []): void;
    protected function logError(string $message, array $context = []): void;

    // ── トランザクション ──────────────────────────
    /** コミット後にログ記録、例外時はロールバック + エラーログ後に再送出 */
    protected function transaction(callable $callback): mixed;

    // ── 共通ユーティリティ ────────────────────────
    protected function resolveTimezone(?string $timezone): string;
    protected function weekdayJa(Carbon $date): string;
    protected function calculateWorkHours(
        mixed $startAt,
        mixed $endAt,
        ?int $workedMinutes = null,
        ?Carbon $fallbackEndTime = null,
    ): ?float;
}
```

### Service 実装例

```php
final class AttendanceService extends BaseService
{
    public function clockIn(User $user): array
    {
        // 副作用のある処理は必ず transaction() でラップ
        return $this->transaction(function () use ($user): array {
            $timezone = $this->resolveTimezone($user->timezone ?? null);
            $now = CarbonImmutable::now($timezone);

            $openAttendance = Attendance::query()
                ->where('user_id', $user->id)
                ->whereNotNull('clock_in_at')
                ->whereNull('clock_out_at')
                ->first();

            if ($openAttendance !== null) {
                // App\Exceptions\DomainException を使う（PHP標準は使わない）
                throw new DomainException('未退勤の勤務が存在します', 'OPEN_ATTENDANCE_EXISTS');
            }

            $attendance = Attendance::query()->create([...]);

            return $attendance->toLocalTimePayload();
        });
    }
}
```

### transaction() の動作

```
callback 実行 → 成功 → DB コミット → INFO ログ → 結果返却
                 ↓ 例外
              DB ロールバック → ERROR ログ → 例外再送出
```

> **落とし穴**: `DB::transaction()` 内でログを書くと、コミット前にログが記録される。`BaseService::transaction()` はコミット後にログを記録するので必ずこれを使う。

## 5. モデル規約

### UUID 主キー

```php
protected $keyType = 'string';
public $incrementing = false;
```

`booted()` フックで UUID を自動生成する。User モデルではパスワードの自動ハッシュも行う。

```php
protected static function booted(): void
{
    static::creating(function (self $model) {
        if (!$model->id) {
            $model->id = (string) Str::uuid();
        }
    });
}
```

### タイムスタンプ・キャスト

日付カラムは `immutable_datetime` / `immutable_date` でキャストする。

```php
protected $casts = [
    'work_date'    => 'immutable_date',
    'clock_in_at'  => 'immutable_datetime',
    'clock_out_at' => 'immutable_datetime',
    'break_minutes' => 'integer',
];
```

### スコープ

`scope` プレフィクスで名前付きスコープを定義する。

```php
public function scopeUser(Builder $query, string $userId): Builder
{
    return $query->where('user_id', $userId);
}

public function scopeMonth(Builder $query, int $year, int $month): Builder
{
    return $query->whereYear('work_date', $year)->whereMonth('work_date', $month);
}
```

### ドメイン判定メソッド

モデルに密接なドメイン判定はモデルに置く。

```php
public function isClockedIn(): bool { ... }
public function isClockedOut(): bool { ... }
public function isWorking(): bool { ... }
public function isCrossDayShift(): bool { ... }
public function calculateWorkedMinutes(?CarbonImmutable $now = null): ?int { ... }
public function toLocalTimePayload(): array { ... }
```

> **落とし穴**: `$fillable` に `id` を含める場合、Seeder/テストで明示的に UUID を指定できるが、`booted()` の自動生成と二重にならないよう `if (!$model->id)` ガードが必須。

## 6. DTO / ValueObject

### BaseDTO

Reflection を使い、コンストラクタの型情報から自動的に Enum・DateTimeImmutable・ValueObject を復元する。

```php
abstract class BaseDTO
{
    /** 配列からDTOを生成する。Enum / DateTimeImmutable / ValueObject を自動変換 */
    public static function fromArray(array $data): static;

    /** DTOを配列へ変換する。値オブジェクトは value() / ->value で展開 */
    public function toArray(): array;
}
```

### DTO 実装例

```php
final class UserProfile extends BaseDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $email,
        public readonly array  $roles,
        public readonly ?array $settings,
        public readonly bool   $isAuthenticated = true,
    ) {}
}

// 使用例
$dto = new UserProfile(id: $user->id, name: $user->name, ...);
return $dto->toArray();
```

### BaseValueObject

イミュータブルな値オブジェクト基底クラス。コンストラクタで `assert()` による妥当性検証を強制する。

```php
abstract readonly class BaseValueObject implements Stringable, JsonSerializable
{
    final public function __construct(string $value)
    {
        $this->assert($value);  // 子クラスで検証ロジックを実装
        $this->value = $value;
    }

    abstract protected function assert(string $value): void;

    final public function value(): string;
    final public function equals(self $other): bool;
    final public function __toString(): string;
    public function jsonSerialize(): mixed;
}
```

### ValueObject 実装例

```php
final readonly class Email extends BaseValueObject
{
    protected function assert(string $value): void
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new DomainException("Invalid email format.");
        }
    }
}

// 使用例
$email = new Email('user@example.com');
$email->value();   // 'user@example.com'
(string) $email;   // 'user@example.com'
```

> **落とし穴**: ValueObject で PHP 標準の `\DomainException` を投げると Handler が 400 ではなく 500 を返す。必ず `App\Exceptions\DomainException` を使う。

## 7. 統一レスポンス形式

### 成功レスポンス

```php
ApiResponse::success($data, '出勤を記録しました');
```

```json
{
    "success": true,
    "message": "出勤を記録しました",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "work_date": "2026-03-21",
        "clock_in_local_time": "09:00"
    },
    "meta": null
}
```

### ページネーション付き成功レスポンス

```php
ApiResponse::success($items, 'Success', 200, ['page' => 1, 'total' => 100]);
```

```json
{
    "success": true,
    "message": "Success",
    "data": [...],
    "meta": { "page": 1, "total": 100 }
}
```

### エラーレスポンス

```php
// Handler が DomainException を自動変換
throw new DomainException('未退勤の勤務が存在します', 'OPEN_ATTENDANCE_EXISTS');
```

```json
{
    "success": false,
    "message": "未退勤の勤務が存在します",
    "code": "OPEN_ATTENDANCE_EXISTS",
    "errors": null
}
```

### バリデーションエラー（422）

```json
{
    "success": false,
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "errors": {
        "email": ["メールアドレスは必須です"]
    }
}
```

### 例外 → HTTP ステータスマッピング

| 例外クラス | HTTP | code |
|---|---|---|
| `App\Exceptions\DomainException` | 400 | カスタム (`OPEN_ATTENDANCE_EXISTS` 等) |
| `AuthenticationException` | 401 | `AUTH_ERROR` |
| `ValidationException` | 422 | `VALIDATION_ERROR` |
| `AuthorizationException` | 403 | `FORBIDDEN_ERROR` |
| `ModelNotFoundException` | 404 | `NOT_FOUND` |
| その他 `Throwable` | 500 | `INTERNAL_ERROR` |

## 8. FormRequest（BaseRequest）

OpenAPI 定義からバリデーションルールを自動取得する。全角数字→半角変換等の正規化も共通化。

```php
abstract class BaseRequest extends FormRequest
{
    /** OpenAPI スキーマ名 */
    protected string $schemaName;

    /** 正規化対象フィールド定義 */
    protected array $filters = [
        'number'  => [],
        'boolean' => [],
    ];

    public function rules(): array
    {
        return OpenApiGeneratedRules::schema($this->schemaName);
    }

    public function attributes(): array
    {
        return OpenApiGeneratedRules::schemaAttributes($this->schemaName);
    }
}
```

### FormRequest 実装例

```php
final class ClockRequest extends BaseRequest
{
    protected string $schemaName = 'ClockInRequest';

    protected array $filters = [
        'number'  => ['break_minutes'],
        'boolean' => ['clock_out_next_day'],
    ];

    // OpenAPI ルールで十分なら rules() のオーバーライド不要
}
```

> **落とし穴**: `prepareForValidation()` で全角数字→半角変換を行うため、`filterNumber()` を通さないと `"１２３"` がバリデーションエラーになる。

## 9. 実務上の注意点

### パスワードの二重ハッシュ

User モデルの `booted()` で `Hash::make()` が自動実行される。Seeder や手動作成時に `Hash::make()` を呼ぶと二重ハッシュになり**ログイン不可能**になる。

```php
// NG — 二重ハッシュになる
$user->fill(['password' => Hash::make('password')]);

// OK — モデルの booted() がハッシュする
$user->fill(['password' => 'password']);
```

### タイムゾーン解決

タイムゾーンの解決は `BaseService::resolveTimezone()` に統一する。直接 `config('app.timezone')` や `'Asia/Tokyo'` をハードコードしない。

```php
// NG
$timezone = $user->timezone ?? 'Asia/Tokyo';

// OK
$timezone = $this->resolveTimezone($user->timezone ?? null);
```

### トランザクション

副作用のある処理は必ず `$this->transaction()` を使う。`DB::transaction()` を直接呼び出さない。

```php
// NG — ログタイミングが不正確、エラーログが記録されない
DB::transaction(function () { ... });

// OK — コミット後ログ + エラーログ + 例外再送出
$this->transaction(function () { ... });
```

### DomainException

PHP 標準の `\DomainException` ではなく、`App\Exceptions\DomainException` を使う。Handler がエラーコード付きで 400 レスポンスに変換する。

```php
use App\Exceptions\DomainException;

throw new DomainException('未退勤の勤務が存在します', 'OPEN_ATTENDANCE_EXISTS');
```

### 認証ユーザー取得

`auth()->user()` を直接呼ばない。`UserService::getAuthUser()` を唯一の窓口とする。Controller からは `$this->resolveUser()` を使う。

```php
// NG — Controller / Service で直接呼ぶ
$user = auth()->user();

// OK — Controller
$user = $this->resolveUser();

// OK — Service
public function __construct(private readonly UserService $userService) {}
$user = $this->userService->getAuthUser();
```

日付は `immutable_datetime` を使用し、不変性を保証する。

## DTO パターン

```php
class UserProfile extends BaseDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly Email $email,
    ) {}
}

// 利用
$dto = UserProfile::fromArray($data);
```

`BaseDTO::fromArray()` は PHP リフレクションで自動ハイドレーションする。Enum・DateTimeImmutable・ValueObject・ネストされた DTO に対応。

## ValueObject

ドメイン固有のバリデーションを持つ不変オブジェクト。

```php
class Email extends ValueObject
{
    protected function validate(mixed $value): void
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException("...");
        }
    }
}
```

## 統一レスポンス形式

すべての API レスポンスは `ApiResponse` を通す。

```json
{
  "success": true,
  "message": "操作が完了しました",
  "data": { ... },
  "meta": null,
  "code": null,
  "errors": null
}
```

エラー時：

```json
{
  "success": false,
  "message": "エラーが発生しました",
  "data": null,
  "meta": null,
  "code": "DOMAIN_ERROR",
  "errors": { ... }
}
```
