# UI 実装規約（Variants / Theme / API）

このドキュメントは、本プロジェクトにおける **UI 実装の統一ルール** を定義する。  
すべての UI 実装者（人・AI 含む）は、本規約に **必ず従うこと**。

---

## 前提

- 本プロジェクトでは **デザインの一貫性・保守性・テーマ切り替え耐性** を最優先とする
- React + TypeScript + Tailwind CSS + class-variance-authority（cva）を前提とする
- 「その場しのぎの className 注入」は禁止し、**設計された Variants API** のみで見た目を制御する

---

## Variants 戦略

### 基本原則

- **すべての見た目は class-variance-authority（cva）で管理する**
- コンポーネントの props に `className` を持たせない  
  - 例外は `unstableClassName` のみ（最終手段・レビュー対象）
- Variants は **最小構成** を厳守する

### 標準 Variants セット

原則として、以下を基本セットとする：

- `variant` : 見た目の種類
- `size` : サイズ / 密度
- `fullWidth` : 横幅いっぱいかどうか

必要になった場合のみ、**1 つずつ慎重に追加**すること。

### intent（意味的な色）

- 色の指定は **semantic intent** で行う
- intent の語彙は以下に統一する：

```ts
primary | neutral | success | warning | danger
```

---

## デザインシステム構成

本プロジェクトのデザインシステムは `@/shared/design-system/` に一元管理される。

### ディレクトリ構造

```
shared/design-system/
├── index.ts          # barrel export
├── tokens.ts         # 色・タイポグラフィ・スペーシング・角丸・影
├── layout.ts         # stack / cluster / grid ユーティリティ
└── variants/
    ├── index.ts      # barrel export
    ├── button.ts     # buttonVariants (CVA)
    ├── typography.ts # typographyVariants (CVA)
    ├── input.ts      # inputVariants / checkableVariants / switchTrackVariants (CVA)
    ├── card.ts       # cardVariants (CVA)
    └── badge.ts      # badgeVariants (CVA)
```

### tokens.ts

UIの見た目を制御する **唯一の真実源 (single source of truth)**。

| カテゴリ       | エクスポート名       | 用途                                  |
| -------------- | -------------------- | ------------------------------------- |
| `colors`       | Semantic color classes | `primary`, `success`, `danger`, etc.  |
| `typography`   | Font size/weight sets  | `h1`, `h2`, `body`, `caption`, etc.   |
| `spacing`      | Gap values             | `xs`〜`xl`                            |
| `radius`       | Border radius          | `sm`〜`full`                          |
| `shadow`       | Shadow levels          | `none`〜`xl`                          |
| `inputBase`    | Input base styles      | border + focus ring + transition      |
| `inputError`   | Error border           | `border-red-500`                      |
| `inputDefault` | Default border         | `border-gray-300`                     |

### layout.ts — レイアウトユーティリティ

`space-y-*` / `space-x-*` / `grid gap-*` を直接書く代わりに使う。

```tsx
import { stack, cluster, grid } from '@/shared/design-system/layout';

// 縦方向のスタック
<div className={stack.md}>  // = "space-y-4"

// 横方向のクラスター
<div className={cluster.sm}>  // = "space-x-2"

// グリッド
<div className={grid.lg}>  // = "grid gap-6"
```

### variants — CVA バリアント

各コンポーネントのバリアント定義は `variants/` に集約。
**コンポーネントファイル内にインライン CVA を書かないこと。**

```tsx
// ✅ Good: design-system からインポート
import { buttonVariants } from '@/shared/design-system/variants/button';
import { inputVariants } from '@/shared/design-system/variants/input';

// ❌ Bad: コンポーネント内でインライン定義
const buttonVariants = cva("base", { variants: { ... } });
```

---

## unstableClassName の制限

`unstableClassName` は **レイアウト調整のみ** に使用する。

### 許可される用途

```tsx
// ✅ spacing / sizing / positioning
unstableClassName="mt-4 mb-6"
unstableClassName="w-full max-w-lg"
unstableClassName="flex items-center gap-2"
unstableClassName="col-span-2"
unstableClassName="overflow-hidden"
```

### 禁止される用途

```tsx
// ❌ 色 — intent prop を使う
unstableClassName="text-gray-500"       // → intent="muted"
unstableClassName="text-blue-600"       // → intent="primary"
unstableClassName="bg-red-50"           // → Card intent="danger"

// ❌ フォントサイズ / ウェイト — variant を使う
unstableClassName="text-2xl font-bold"  // → variant="h2"
unstableClassName="text-xs"             // → variant="small"

// ❌ ボーダー / 角丸 — variant or tokens を使う
unstableClassName="rounded-xl"          // → tokens.radius.lg
unstableClassName="border-gray-200"     // → variant で制御
```