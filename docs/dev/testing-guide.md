# テストガイド

## テスト戦略

| テスト種別 | ツール | 対象 |
|---|---|---|
| ユニットテスト | PHPUnit | Service, Model, ValueObject |
| フィーチャーテスト | PHPUnit + HTTP | Controller, API エンドポイント |
| フロントエンド | （未導入） | — |

## バックエンドテスト

### 実行方法

```bash
# 全テスト実行
make test

# 特定のテストファイル
cd back && php artisan test --filter=AttendanceServiceTest

# 特定のテストメソッド
cd back && php artisan test --filter=it_returns_authenticated_user
```

### ディレクトリ構成

```
back/tests/
├── TestCase.php              # 基底テストクラス
├── AuthenticatedUser.php     # 認証ヘルパートレイト
├── CreatesApplication.php    # アプリ起動トレイト
├── Feature/                  # API 統合テスト
└── Unit/                     # ユニットテスト
```

### テストの書き方

#### 基本構造

```php
class AttendanceServiceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_records_clock_in(): void
    {
        // Arrange（準備）
        $user = User::factory()->create();

        // Act（実行）
        $result = $this->service->clockIn($user);

        // Assert（検証）
        $this->assertNotNull($result);
        $this->assertDatabaseHas('attendances', [
            'user_id' => $user->id,
        ]);
    }
}
```

#### 命名規則

- テストクラス: `{対象クラス}Test`（例: `AttendanceServiceTest`）
- テストメソッド: `it_{期待する動作}`（例: `it_records_clock_in`）
- `@test` アノテーションを使用する

#### 認証付きテスト

```php
class AttendanceControllerTest extends TestCase
{
    use RefreshDatabase, AuthenticatedUser;

    /** @test */
    public function it_returns_attendance_list(): void
    {
        $this->login();

        $response = $this->getJson('/api/attendance-records');

        $response->assertOk()
                 ->assertJsonStructure(['success', 'data']);
    }
}
```

### テストデータ

- Factory パターンで生成する: `User::factory()->create()`
- `RefreshDatabase` トレイトでテストごとに DB をリセットする
- シーダーのテスト利用は避ける（テストの独立性を保つ）

## フロントエンドテスト

現時点では未導入。導入時は以下の構成を推奨する:

| ツール | 用途 |
|---|---|
| Vitest | ユニットテスト / フック |
| React Testing Library | コンポーネントテスト |
| MSW | API モック |

## CI でのテスト

`.github/workflows/openapi-check.yml` で以下を自動チェックする:
- OpenAPI Lint
- 自動生成コードの drift チェック（Enum / バリデーションルール）
