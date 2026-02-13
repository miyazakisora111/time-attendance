# 新しいアプリケーション構成ガイド

## ディレクトリ構成

### 概要
新しい構造は、クリーンアーキテクチャとドメイン駆動設計（DDD）の原則に基づいています。

```
app/
├── Http/                          # HTTP層
│   ├── Controllers/               # リクエスト処理
│   ├── Requests/                  # フォームバリデーション
│   ├── Resources/                 # レスポンス変換
│   └── Middleware/                # リクエスト/レスポンス処理
│
├── Models/                        # Eloquentモデル
│   ├── Traits/                    # 再利用可能な機能
│   ├── Casts/                     # 属性キャスト
│   └── Observers/                 # ライフサイクルイベント
│
├── UseCases/                      # ビジネスロジック（主要なドメイン操作）
├── Repositories/                  # データアクセス層抽象化
├── Queries/                       # データ読み取り操作（CQRS）
├── Services/                      # ビジネスロジック（再利用可能なサービス）
│   └── External/                  # 外部API統合
│
├── DTO/                           # データ転送オブジェクト
├── ValueObjects/                  # ドメイン値オブジェクト
├── Enums/                         # 列挙型
│
├── Events/                        # イベント定義
├── Listeners/                     # イベントリスナー
├── Jobs/                          # 非同期ジョブ
│
├── Rules/                         # カスタムバリデーションルール
├── Exceptions/                    # カスタム例外
├── Logging/                       # ロギングユーティリティ
├── Actions/                       # アクション（複合操作）
├── Policies/                      # 認可ポリシー
├── Providers/                     # サービスプロバイダー
└── Console/                       # CLIコマンド
    └── Commands/
```

## ベストプラクティス

### 1. **型安全性（PHP 8.4対応）**
```php
// ✅ 推奨：命名型、Union型、Intersection型を活用
public function handle(User $user, string $action): bool {}

// ✅ Readonly プロパティを活用
private readonly UserRepository $repository;

// ✅ Named arguments を活用
$user = $repository->findById(id: $userId);
```

### 2. **DTO で層間通信**
```php
// ✅ リポジトリはモデルを、コントローラーはDTOを返す
$user = $repository->findById($id);
$userData = UserData::fromArray($user->toArray());
return new UserResource($userData);
```

### 3. **UseCases で複雑なロジック**
```php
// ✅ ビジネスロジックをUseCaseに実装
try {
    $userData = $this->createUserUseCase->execute($validated);
} catch (DomainException $e) {
    return $this->error($e->getMessage(), 400);
}
```

### 4. **ValueObjects で値の検証**
```php
// ✅ ValueObjectで値の整合性を保証
public function __construct(string $email) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new DomainException("Invalid email");
    }
    $this->value = strtolower($email);
}
```

### 5. **列挙型で状態管理**
```php
// ✅ 列挙型でステータスを厳密に管理
$user->status = UserStatus::ACTIVE;
$user->status->isActive(); // メソッド呼び出し可能
```

### 6. **DI コンテナを活用**
```php
// ✅ AppServiceProviderでバインディング
$this->app->bind(UserRepository::class, function ($app) {
    return new UserRepository();
});

// ✅ コンストラクタインジェクション
public function __construct(
    private readonly UserRepository $repository,
) {}
```

### 7. **イベント駆動設計**
```php
// ✅ 重要なビジネスイベントを発行
event(new UserCreated($user));

// ✅ リスナーで非同期処理
class SendWelcomeMail implements ShouldQueue {}
```

### 8. **ポリシーで認可**
```php
// ✅ コントローラー内で
$this->authorize('view', $user);

// ✅ ポリシークラスで実装
public function view(?User $user, User $model): bool {
    return $user?->id === $model->id || $user?->isAdmin();
}
```

## 使用例

### ユーザーを作成
```php
// コントローラー内
public function store(StoreRequest $request): JsonResponse {
    try {
        $userData = $this->createUserUseCase->execute(
            $request->validated()
        );
        return $this->success(
            new UserResource($userData),
            'User created successfully',
            201
        );
    } catch (DomainException $e) {
        return $this->error($e->getMessage(), 400);
    }
}
```

### ユーザーを検索
```php
// コントローラー内
$query = new UserListQuery(
    repository: $this->userRepository,
    page: $request->integer('page', 1),
    perPage: $request->integer('per_page', 15),
    status: $request->string('status'),
);

$paginator = $query->execute();
```

### ロギング
```php
// アクティビティロギング
ActivityLogger::logUserAction(
    userId: auth()->id(),
    action: 'USER_CREATED',
    details: ['user_id' => $user->id],
);

// API呼び出しログ
ActivityLogger::logApiCall(
    method: 'POST',
    endpoint: '/api/v1/users',
    statusCode: 201,
);
```

## マイグレーション

```bash
# migration を実行
php artisan migrate

# 新しいmigrationを作成
php artisan make:migration create_table_name
```

## コマンド実行

```bash
# ユーザー同期を実行
php artisan users:sync --source=ldap
```

## テスト例

```php
public function test_user_creation() {
    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'SecurePass123!',
    ];

    $response = $this->postJson('/api/v1/users', $userData);

    $response->assertStatus(201)
        ->assertJsonPath('data.email', 'test@example.com');
}
```

## PHP 8.4 の新機能

### 1. **属性の改善**
```php
#[ObservedBy([UserObserver::class])]
class User extends Model {}
```

### 2. **Readonly クラス**
```php
final readonly class UserData {
    public function __construct(
        public string $id,
        public string $name,
    ) {}
}
```

### 3. **Union/Intersection型**
```php
public function handle(string|int $id): UserData|null {}
```

### 4. **Named Arguments**
```php
$this->createCharge(
    customerId: $id,
    amountCents: 10000,
    currency: 'JPY',
);
```

### 5. **Match式の拡張**
```php
$label = match($status) {
    UserStatus::ACTIVE => 'アクティブ',
    UserStatus::INACTIVE => '非アクティブ',
    default => '不明',
};
```

## 環境変数（.env の例）

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=time_attendance
DB_USERNAME=root
DB_PASSWORD=

PAGINATION_PER_PAGE=15
PAGINATION_MAX_PER_PAGE=100
USER_PASSWORD_MIN_LENGTH=12

STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

FEATURE_USER_SYNC=true
FEATURE_ACTIVITY_LOGGING=true
```

## 今後のタスク

- [ ] テストスイートの追加
- [ ] API ドキュメント生成（OpenAPI/Swagger）
- [ ] キャッシュ戦略の実装
- [ ] 監査ログの詳細化
- [ ] レート制限ポリシーの追加
- [ ] 二要素認証の実装
