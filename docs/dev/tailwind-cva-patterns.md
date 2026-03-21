# Tailwind CSS + CVA デザインパターン

## 概要

Tailwind CSS 4 と Class Variance Authority (CVA) を組み合わせたスタイリング設計。デザイントークン、バリアント管理、ダークモード対応を解説する。

## 技術スタック

| ライブラリ | バージョン | 役割 |
|---|---|---|
| Tailwind CSS | 4.x | ユーティリティファースト CSS |
| `@tailwindcss/vite` | 最新 | Vite プラグイン統合 |
| CVA | (`class-variance-authority`) | バリアント管理 |
| `tailwind-merge` | 最新 | クラス名の競合解決 |
| `clsx` | 最新 | 条件付きクラス結合 |

## ディレクトリ構成

```
shared/design-system/
├── index.ts          # 公開 API
├── layout.ts         # レイアウトユーティリティ
├── tokens.ts         # デザイントークン
└── variants/
    ├── badge.ts      # Badge バリアント
    ├── button.ts     # Button バリアント
    ├── card.ts       # Card バリアント
    ├── input.ts      # Input バリアント
    ├── typography.ts # Typography バリアント
    └── index.ts      # バリアント公開
```

## CVA バリアント定義

```typescript
// shared/design-system/variants/button.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
    // ベーススタイル
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary:   'bg-blue-600 text-white hover:bg-blue-700',
                secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
                danger:    'bg-red-600 text-white hover:bg-red-700',
                ghost:     'hover:bg-gray-100 hover:text-gray-900',
                link:      'text-blue-600 underline-offset-4 hover:underline',
            },
            size: {
                sm: 'h-8 px-3 text-sm',
                md: 'h-10 px-4 text-sm',
                lg: 'h-12 px-6 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
```

## コンポーネントでの使用

```typescript
// shared/components/buttons/Button.tsx
import { buttonVariants, type ButtonVariantProps } from '@/shared/design-system';
import { cn } from '@/shared/utils/style';

interface ButtonProps extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
    children: React.ReactNode;
}

export function Button({ variant, size, className, children, ...props }: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {children}
        </button>
    );
}

// 使用
<Button variant="primary" size="lg">出勤</Button>
<Button variant="danger" size="sm">退勤</Button>
```

## cn() ユーティリティ

```typescript
// shared/utils/style.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

## デザイントークン

```typescript
// shared/design-system/tokens.ts
export const tokens = {
    colors: {
        primary:   'blue-600',
        secondary: 'gray-100',
        danger:    'red-600',
        success:   'green-600',
    },
    spacing: {
        page: 'p-6',
        card: 'p-4',
        section: 'space-y-4',
    },
    borderRadius: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
    },
} as const;
```

## ダークモード

```typescript
// tailwind.config.ts
export default {
    darkMode: 'class',  // クラスベース切り替え
    content: ['./src/**/*.{ts,tsx}'],
};

// コンポーネントでの使用
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

## 注意: 設計レビュー指摘事項

| 問題 | 影響 | 改善案 |
|---|---|---|
| **デザイントークンが TypeScript 内** | デザイナーがトークンを参照しにくい | CSS カスタムプロパティ (`--color-primary`) との連携を検討 |
| **CVA バリアントに Tailwind クラスが直書き** | Tailwind のバージョンアップ時にクラス名変更が影響 | 影響範囲は `variants/` に集約されているので許容 |
| **ダークモード対応が一部のみ** | 全コンポーネントが `dark:` プレフィクスに対応していない | `UserSetting.theme` と連携して、グローバルに `dark` クラスを切り替え |
| **Tailwind CSS 4 のブレークングチェンジ** | v3 → v4 での設定構造変更に注意 | `@tailwindcss/vite` プラグインで v4 対応済みだが、カスタム設定を確認 |
| **`tailwind-merge` の不要な呼び出し** | 全コンポーネントで `cn()` を使うとオーバーヘッド | 実際の競合が発生しない場所では `clsx()` のみで十分 |
