# デザインシステム

> UI スタイリングの詳細規約は [style.md](./style.md) を参照。  
> ここではデザインシステムの構成と利用方法をまとめる。

## 構成

```
shared/design-system/
├── index.ts          # barrel export
├── tokens.ts         # デザイントークン（色・タイポグラフィ・スペーシング等）
├── layout.ts         # レイアウトユーティリティ
└── variants/         # CVA バリアント定義
    ├── index.ts
    ├── button.ts
    ├── typography.ts
    ├── input.ts
    ├── card.ts
    └── badge.ts
```

## デザイントークン (`tokens.ts`)

すべての見た目に関する値の **唯一のソース**。

### カラー

Semantic Color（意味的な色）で定義する。ハードコードされた Tailwind カラー（`bg-blue-500` 等）を直接使用しない。

```typescript
// intent の語彙
primary | neutral | success | warning | danger
```

### タイポグラフィ

```typescript
// サイズ階層
h1 | h2 | h3 | body | caption | small
```

### スペーシング

```typescript
// 余白サイズ
xs | sm | md | lg | xl
```

## レイアウトユーティリティ (`layout.ts`)

再利用可能なレイアウトパターン:

| ユーティリティ | 用途 | CSS |
|---|---|---|
| `stack` | 縦積み | `space-y-{n}` |
| `cluster` | 横並び | `space-x-{n}` |
| `grid` | グリッド | `grid gap-{n}` |

## CVA バリアント

### 使用ルール

1. 見た目の制御は **CVA（class-variance-authority）のみ**
2. コンポーネントの `className` props は禁止（`unstableClassName` のみ例外）
3. クラス結合は必ず `cn()` を使う

### Button バリアント

```typescript
buttonVariants({
  variant: 'solid' | 'outline' | 'ghost',
  intent: 'primary' | 'secondary' | 'success' | 'danger' | 'warning',
  size: 'sm' | 'md' | 'lg',
  fullWidth: boolean,
})
```

### Card バリアント

```typescript
cardVariants({
  variant: 'elevated' | 'flat',
  padding: 'sm' | 'md' | 'lg',
  intent: 'primary' | 'neutral' | ...,
})
```

### Input バリアント

```typescript
inputVariants({
  variant: 'default' | 'error',
})
```

## テーマ対応

`ThemeType` Enum で `light` / `dark` を管理する。Tailwind CSS のダークモード機能を活用する。

## 新しいコンポーネントの追加手順

1. 必要なバリアントを `shared/design-system/variants/` に定義
2. コンポーネントを `shared/components/` に作成
3. バリアントを Props 経由で受け取り、`cn()` で結合
4. `unstableClassName` は最終手段としてのみ提供（レビュー必須）

```tsx
import { cn } from '@/shared/utils/style';
import { badgeVariants } from '@/shared/design-system/variants/badge';

type Props = {
  intent?: 'primary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
};

const Badge = ({ intent = 'primary', children }: Props) => (
  <span className={cn(badgeVariants({ intent }))}>
    {children}
  </span>
);
```
