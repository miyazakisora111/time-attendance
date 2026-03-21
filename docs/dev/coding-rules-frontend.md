# フロントエンド コーディング規約

## TypeScript 全般

- `strict: true` を前提とする
- `any` は原則禁止。やむを得ない場合は `unknown` + 型ガードを使う
- `as` によるキャストは最小限にする
- 型推論が効く場面での明示的な型注釈は不要

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase | `AttendancePage` |
| フック | camelCase, `use` プレフィクス | `useAuth()` |
| ユーティリティ関数 | camelCase | `formatMinutesToTime()` |
| 定数 | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| 型 / インターフェース | PascalCase | `AuthUser`, `ApiError` |
| ファイル名（コンポーネント） | PascalCase.tsx | `LoginPage.tsx` |
| ファイル名（それ以外） | kebab-case.ts | `api-error.ts` |
| CSS クラス | Tailwind ユーティリティのみ | — |

## コンポーネント

- 関数コンポーネント + アロー関数で定義する
- Props 型はコンポーネントと同じファイルに定義する
- `React.FC` は使わない。引数の型注釈で対応する
- `children` は明示的に props に含める

```tsx
type Props = {
  title: string;
  children: React.ReactNode;
};

const Card = ({ title, children }: Props) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

## スタイリング

- 見た目の制御は **CVA（class-variance-authority）のみ** で行う
- コンポーネントに `className` props を持たせない
  - 例外: `unstableClassName`（最終手段、レビュー必須）
- クラス結合は `cn()` (`twMerge(clsx(...))`) を必ず使う
- インラインスタイルは禁止
- 色・サイズ等は `shared/design-system/tokens.ts` のトークンを参照する

### intent（意味的な色）の語彙

```
primary | neutral | success | warning | danger
```

## フォーム

- `React Hook Form` + `Zod` を必ず使う
- バリデーションスキーマは自動生成の `validationSchemas` を使う
- フォームは `<Form>` コンポーネントでラップする
- 各入力は `useFormContext()` で自動連携される

## API 呼び出し

- 自動生成された React Query フックを優先する
- カスタムラッパーが必要な場合は `api/*.api.ts` に `Result<T>` パターンで実装する
- `useQuery` / `useMutation` を直接使うのは `hooks/` ディレクトリ内のみ

## インポート順序

```typescript
// 1. React / 外部ライブラリ
import { useState } from 'react';
import { useNavigate } from 'react-router';

// 2. プロジェクト内部（絶対パス @/）
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/buttons/Button';

// 3. 相対パス（同一 feature 内）
import { LoginForm } from './LoginForm';
```

## 禁止事項

- `document.querySelector` 等の直接 DOM 操作
- `localStorage` の直接アクセス（`lib/http/client.ts` の関数を経由する）
- `console.log` の本番コードへの残置
- `// @ts-ignore` / `// @ts-expect-error` の安易な使用
- `index.ts` でのロジック実装（re-export のみ許可）
