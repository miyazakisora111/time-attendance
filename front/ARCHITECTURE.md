# React Time Attendance - フロントエンド

Figmaデザインを基にしたReactの時間管理アプリケーションフロントエンド

## 🎨 プロジェクト構造

```
src/
├── app/
│   └── App.tsx                    # ルートコンポーネント
├── pages/
│   ├── login/                     # ログインページ
│   └── dashboard/                 # ダッシュボードページ
├── features/
│   └── ...                        # 機能モジュール
├── shared/
│   ├── components/
│   │   ├── atoms/                 # 基本コンポーネント（Button, Input等）
│   │   ├── molecules/             # 組み合わせコンポーネント（FormField等）
│   │   ├── organisms/             # 大型コンポーネント（Header, Sidebar等）
│   │   └── layout/                # レイアウトコンポーネント
│   ├── types/                     # TypeScript型定義
│   ├── hooks/                     # カスタムReact Hooks
│   ├── utils/                     # ユーティリティ関数
│   ├── constants/                 # アプリケーション定数
│   ├── api/                       # API通信クライアント
│   ├── contexts/                  # React Context
│   └── style/                     # グローバルスタイル、テーマ定義
├── assets/                        # 画像、SVG等
└── main.tsx                       # エントリーポイント
```

## 🚀 クイックスタート

### インストール

```bash
cd front
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

## 🏛️ アーキテクチャ

### Atomic Design パターン

コンポーネントは以下の3段階で構成されています：

#### Atoms（原子）
最小単位の再利用可能なコンポーネント
- `Button` - ボタン
- `Input` - テキスト入力
- `Text` - テキスト表示
- `Badge` - バッジ表示
- `Card` - カード
- `Spinner` - ローディング表示

#### Molecules（分子）
複数のAtomsを組み合わせたコンポーネント
- `FormField` - ラベル + 入力フィールド
- `ButtonGroup` - ボタングループ
- `Alert` - アラート表示

#### Organisms（有機体）
複数のMoleculesやAtomsを組み合わせた大型コンポーネント
- `Header` - ヘッダー
- `Sidebar` - サイドバーナビゲーション  
- `Footer` - フッター
- `Modal` - モーダルダイアログ
- `MainLayout` - メインレイアウト

### コンテナ/プレゼンテーション分割

- **プレゼンテーションコンポーネント** - UIロジックのみ（`shared/components/*`）
- **コンテナコンポーネント** - ビジネスロジック（`pages/**/*Page.tsx`）

## 📦 主要な技術スタック

- **React** 18.3.1 - UIライブラリ
- **TypeScript** - 型安全
- **Tailwind CSS** - ユーティリティCSS
- **Radix UI** - アクセシブルなUIコンポーネント
- **Vite** - 高速ビルドツール

## 🎨 デザインシステム

### テーマ変数

`src/shared/style/theme.ts` にテーマが定義されています：

```typescript
import { theme } from '@/shared/style/theme';

// 色パレット
theme.colors.primary
theme.colors.gray
theme.colors.success

// スペーシング
theme.spacing.md
theme.spacing.lg

// タイポグラフィ
theme.typography.fontSize.base
theme.typography.fontWeight.bold
```

### CSS変数

グローバルCSS変数が `src/shared/style/globals.css` で定義されています：

```css
var(--color-primary-600)
var(--spacing-4)
var(--font-size-lg)
var(--shadow-md)
```

## 🧠 カスタムHooks

### useForm
フォーム管理用のHook

```typescript
const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
  { email: '', password: '' },
  async (values) => { /* submit logic */ },
  (values) => { /* validation */ }
);
```

### useAsync
非同期操作管理用のHook

```typescript
const { data, error, status, isLoading } = useAsync(
  () => fetchData(),
  true // immediate
);
```

### useLocalStorage
ローカルストレージ管理用のHook

```typescript
const [value, setValue, removeValue] = useLocalStorage('key', 'initialValue');
```

### useDebounce
デバウンス処理用のHook

```typescript
const debouncedValue = useDebounce(value, 500);
```

## 🔐 状態管理

### グローバル状態

- **認証情報** - `localStorage` に保存
- **ユーザー情報** - `localStorage` に保存

将来的に `Redux` または `Zustand` への移行を検討

### ローカル状態

- **フォーム入力値** - `useForm` Hook
- **UI状態** - `useState`
- **非同期処理** - `useAsync` Hook

## 📡 API通信

APIクライアント: `src/shared/api/client.ts`

```typescript
import { apiClient, login, clockIn } from '@/shared/api/client';

// ログイン
const response = await login('email@example.com', 'password');

// 出勤
await clockIn();
```

## ♿ アクセシビリティ

- ARIA属性の適切な使用
- キーボードナビゲーション対応
- 色コントラスト配慮
- セマンティックHTMLの使用

## 🧪 テスト

テストの実装は後続で行う予定：
- Jest + React Testing Library
- コンポーネントユニットテスト
- 統合テスト

## 📖 Storybook

Storybookへのコンポーネント登録は後続で検討予定

## 🚀 パフォーマンス最適化

- React.memo による不要な再レンダリング防止
- useMemo / useCallback による値・関数の最適化
- Code Splitting（Lazy Loading）
- 画像の Lazy Loading

## 🌐 レスポンシブデザイン

- モバイル（320px以上）
- タブレット（768px以上）
- PC（1024px以上）

Tailwind CSSのブレークポイント利用：

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* レスポンシブグリッド */}
</div>
```

## 🔧 環境変数

`.env` ファイルで設定：

```env
VITE_API_URL=http://localhost:8000/api
VITE_ENVIRONMENT=development
```

## 📝 コード規則

- ESLint / Prettier でコードを統一
- TypeScript で型安全性を確保
- BEM形式でCSS クラス名を命名
- コンポーネント名はPascalCase
- ファイル名は適切なフォルダに整理

## 🐛 デバッグ

React DevToolsでの確認：
- コンポーネント構造
- 状態とProps
- パフォーマンスプロファイリング

## 📚 参考リソース

- [React公式ドキュメント](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Atomic Design](https://atomicdesign.bradfrost.com)

## 📄 ライセンス

MIT
