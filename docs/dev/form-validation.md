# フォーム・バリデーション設計

## 設計思想

バリデーションルールは **OpenAPI 定義が唯一のソース** である。ここから以下を自動生成する:

- **フロントエンド**: Zod スキーマ（React Hook Form で使用）
- **バックエンド**: Laravel FormRequest ルール

これにより、フロント・バック間のバリデーションルールの乖離を防ぐ。

## 自動生成パイプライン

```
openapi/components/schemas/*.yaml
        ↓ make openapi-validators
        ↓
  ┌─────┴─────┐
  ↓            ↓
front/src/     back/app/Http/Requests/
__generated__/  Generated/
zod.validation.ts  OpenApiGeneratedRules.php
```

## フロントエンド

### フォーム構造

```tsx
import { Form } from '@/shared/components/forms/Form';
import { Input } from '@/shared/components/forms/Input';
import { SubmitButton } from '@/shared/components/buttons/SubmitButton';
import { validationSchemas } from '@/__generated__/zod.validation';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginPage = () => {
  const handleSubmit = async (data) => { ... };

  return (
    <Form
      formOptions={{
        resolver: zodResolver(validationSchemas.LoginRequest),
      }}
      onSubmit={handleSubmit}
    >
      <Input name="email" label="メールアドレス" />
      <Input name="password" label="パスワード" type="password" />
      <SubmitButton>ログイン</SubmitButton>
    </Form>
  );
};
```

### バリデーション実行のタイミング

1. **フロント（Zod）**: フォーム送信時にクライアントサイドでバリデーション
2. **バック（FormRequest）**: API HTTPリクエスト受信時にサーバーサイドでバリデーション

クライアントサイドバリデーションは UX 向上のためであり、サーバーサイドバリデーションが最終的な防御線。

### エラー表示

- Zod バリデーションエラー → React Hook Form が自動でフィールドエラーに変換
- サーバーバリデーションエラー（422） → `errors` オブジェクトを `setError()` でフォームに反映可能

### フィールドラベル

`field-labels.json` にフィールド名→日本語ラベルのマッピングを自動生成する。バリデーションメッセージに使用:

```
メールアドレスは必須です。
パスワードは8文字以上で入力してください。
```

## バックエンド

### FormRequest の構造

```php
class LoginRequest extends BaseRequest
{
    protected string $schemaName = 'LoginRequest';

    // ルールは OpenApiGeneratedRules::schema() から自動取得
    // 追加ルールが必要な場合のみオーバーライド
}
```

### BaseRequest の機能

- `$schemaName` を参照して `OpenApiGeneratedRules::schema()` からルールを取得
- `prepareForValidation()` で数値・真偽値の入力を正規化
- `attributes()` で `OpenApiGeneratedRules::schemaAttributes()` からラベルを取得

### カスタムルールの追加

OpenAPI で表現できない複雑なルール（DB 存在チェック等）は `rules()` をオーバーライドして追加する:

```php
public function rules(): array
{
    return array_merge(parent::rules(), [
        'email' => ['unique:users,email'],
    ]);
}
```

## フィールドメタデータ (`fields.yaml`)

```yaml
auth:
  email:
    type: email
    label: メールアドレス
    required: true
    description: ユーザーのメールアドレス
  password:
    type: password
    label: パスワード
    required: true
```

このファイルはバリデーションメッセージの日本語化と型の補完に使用する。
