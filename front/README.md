# 時間管理システム - フロントエンド

Figmaデザインを基にReactで構築した時間管理（出退勤）アプリケーション。

## 🎯 プロジェクト概要

このプロジェクトはFigmaのプロトタイプから、**Atomic Design** パターンを採用したReactアプリケーションへの完全なリファクタリングです。

**実装状況：Phase 1完了 ✅**

- ✅ Atomic Design による コンポーネント構造化
- ✅ TypeScript による型安全実装
- ✅ テーマ・デザイン変数の統一
- ✅ 再利用可能なコンポーネント群
- ✅ カスタムHooks でのロジック抽象化
- ✅ API通信レイヤの実装

## 📚 ドキュメント

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - プロジェクト構造・技術スタック詳説
- **[REFACTORING_CHECKLIST.md](./REFACTORING_CHECKLIST.md)** - リファクタリング進捗・次のステップ

## 🏗️ アーキテクチャ

### Atomic Design分類

```
shared/components/
├── atoms/          # Button, Input, Text, Badge, Card, Spinner, Label
├── molecules/      # FormField, ButtonGroup, Alert
├── organisms/      # Header, Footer, Sidebar, Modal, MainLayout
└── layout/         # ページレイアウト
```

### フォルダ構成

```
src/
├── app/              # ルートコンポーネント
├── pages/            # ページコンポーネント（Container）
├── features/         # 機能別モジュール
└── shared/
    ├── components/   # Atomic Design Components
    ├── types/        # TypeScript型定義
    ├── hooks/        # カスタムReact Hooks
    ├── utils/        # ユーティリティ関数
    ├── constants/    # アプリケーション定数
    ├── api/          # API通信クライアント
    ├── style/        # グローバルCSS・テーマ
    └── contexts/     # React Context（予定）
```

## 🚀 クイックスタート

### 開発環境セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

### ビルド

```bash
npm run build
```

## 🛠️ 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|-----|----------|
| **フレームワーク** | React | 18.3.1 |
| **言語** | TypeScript | - |
| **スタイリング** | Tailwind CSS | v4 |
| **UI Components** | Radix UI | Latest |
| **ビルドツール** | Vite | 6.3.5 |
| **パッケージマネージャ** | npm | - |

### 主要ライブラリ

- **react-hook-form** - フォーム管理
- **recharts** - グラフ表示
- **react-day-picker** - 日付選択
- **lucide-react** - アイコン
- **next-themes** - テーマ管理


The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
