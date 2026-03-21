# バックエンドアーキテクチャ

## レイヤー構成

```
HTTP Request
  ↓
Middleware (LogApiRequest, SetJsonContentType)
  ↓
Controller (薄いハンドラー)
  ↓
FormRequest (バリデーション — OpenAPI 自動生成ルール)
  ↓
Service (ビジネスロジック)
  ↓
Repository / Model (データアクセス)
  ↓
ApiResponse::success() / ApiResponse::error()
```

### 各レイヤーの責務

| レイヤー | 責務 | やっていいこと | やってはいけないこと |
|---|---|---|---|
| Controller | リクエスト受付・Service 呼び出し・レスポンス返却 | `resolveUser()` で認証ユーザー取得 | ビジネスロジックを書く |
| FormRequest | 入力バリデーション | OpenAPI ルール参照 | DB アクセス |
| Service | ビジネスルール・ドメインロジック | トランザクション管理、例外送出 | 直接レスポンスを返す |
| Repository | データ取得・永続化の抽象化 | Eloquent クエリ構築 | ビジネスルール判定 |
| Model | テーブル定義・リレーション・スコープ | キャスト、アクセサ | HTTP 関連の処理 |

## BaseController

全コントローラーは `BaseController` を継承する。

```php
// 認証ユーザーの取得
$user = $this->resolveUser();
```

## BaseService

全サービスは `BaseService` を継承する。

```php
// ログ出力
$this->log('info', '打刻処理開始', ['user_id' => $userId]);

// トランザクション
$this->transaction(function () use ($data) {
    // ...
});
```

## モデル規約

### UUID 主キー

```php
// HasUuid トレイトで自動設定
use HasUuid;

public $incrementing = false;
protected $keyType = 'string';
```

`booted()` フックで `Str::uuid()` を自動設定する。

### タイムスタンプ

すべてタイムゾーン付き（`timestampsTz()`）。ソフトデリート対応。

### キャスト

```php
protected $casts = [
    'clocked_in_at' => 'immutable_datetime',
    'email' => EmailCast::class,
];
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
