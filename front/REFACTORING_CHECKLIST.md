# リファクタリングチェックリスト

このドキュメントは、Figmaプロジェクトから ReactへのリファクタリングにおいてToDoアイテムを追跡しています。

## ✅ 完了項目

### 基盤構築
- [x] **1. Atomic Design 構造** - フォルダを atoms, molecules, organisms に分類
- [x] **2. 型定義** - 共通型を shared/types に集約
- [x] **3. テーマ定義** - theme.ts でカラー・スペーシング・タイポグラフィ統一
- [x] **4. グローバルスタイル** - globals.css で CSS 変数定義

### Atomic Components
- [x] **Atoms 実装** - Button, Input, Text, Badge, Label, Spinner, Card
- [x] **Molecules 実装** - FormField, ButtonGroup, Alert
- [x] **Organisms 実装** - Header, Footer, Sidebar, MainLayout, Modal

### コンテナ化
- [x] **Login Page** - LoginPage.tsx でコンテナコンポーネント化
- [x] **Dashboard Page** - DashboardPage.tsx でコンテナコンポーネント化

### State/Hooks
- [x] **useForm** - フォーム管理用カスタムHook
- [x] **useAsync** - 非同期処理管理用カスタムHook
- [x] **useLocalStorage** - ストレージ管理用カスタムHook
- [x] **useDebounce** - デバウンス処理用カスタムHook

### Utilities
- [x] **ユーティリティ関数** - cn, formatDate, getTimeDifference 等
- [x] **定数管理** - API_ENDPOINTS, BREAKPOINTS, STORAGE_KEYS 等
- [x] **APIクライアント** - fetch ベースの API 通信クライアント

### 設定・インフラ
- [x] **環境変数** - .env ファイルで API URL 等を定義
- [x] **TypeScript** - env.d.ts で 環境変数の型定義
- [x] **ドキュメント** - ARCHITECTURE.md でプロジェクト構文説明

## ⏳ 推奨される次のステップ

### すぐに実装すべき項目
- [ ] **Redux/Zustand導入** - グローバルState管理
  - 認証状態（トークン、ユーザー情報）
  - アプリケーション設定
  
- [ ] **React Router** - ページルーティング
  - Route 定義
  - Protected Routes
  - Navigation state

- [ ] **エラーハンドリング** - ErrorBoundary 実装
  - API エラーハンドリング
  - エラー画面表示
  - リトライロジック

### パフォーマンス最適化
- [ ] **React.memo 適用** - 不要な再レンダリング防止
- [ ] **useMemo/useCallback** - 値・関数の メモ化
- [ ] **Code Splitting** - lazy loading と Suspense
- [ ] **Virtual List** - 大量データ表示の最適化
- [ ] **画像最適化** - lazy loading、webp対応、リサイズ

### テスト・品質
- [ ] **Jest 設定** - テスト環境セットアップ
- [ ] **React Testing Library** - コンポーネント テスト
- [ ] **ESLint/Prettier** - コード品質チェック
- [ ] **TypeScript strictMode** - 型チェック厳格化
- [ ] **Storybook** - コンポーネント カタログ化

### 機能実装
- [ ] **出退勤機能**
  - ClockIn/ClockOut API
  - リアルタイム時刻表示
  
- [ ] **レポート機能**
  - 出退勤統計
  - PDF へのエクスポート
  
- [ ] **ユーザー管理**
  - プロフィール編集
  - パスワード変更

### デザイン未実装
- [ ] **複数テーマ対応**
  - Light/Dark Mode
  - カスタムテーマ選択
  
- [ ] **レスポンシブ調整**
  - モバイルファースト で再チェック
  - タブレット表示最適化
  
- [ ] **アニメーション**
  - ページトランジション
  - ホバー・クリック エフェクト
  - ローディングアニメーション

## 📋 詳細チェックリスト

各項目の詳細は以下を参照：

### UI/UX
- [ ] **1. Atomic Design分類** - 全Figmaコンポーネントを分類
- [ ] **2. 再利用性抽出** - 重複コンポーネントを統一
- [ ] **3. Props/State分離** - 入力値の型定義統一
- [ ] **4. Presentation/Container** - 全Pageで適用
- [ ] **5. スタイル分離** - Tailwind有効活用
- [ ] **6. デザイン変数** - Figmaから全値を抽出
- [ ] **7. ネスト削減** - DOM階層を浅く
- [ ] **8. インラインスタイル削除** - 全て CSS 化
- [ ] **9. TypeScript型安全** - Props・State全て型付け
- [ ] **10. 依存関係最小化** - コンポーネント 独立化

### レスポンシブ
- [ ] **11. Flexbox/Grid活用** - レイアウト柔軟化
- [ ] **12. 相対幅使用** - 固定幅削除
- [ ] **13. フォントサイズ調整** - viewport対応
- [ ] **14. メディアクエリ** - コンポーネント毎管理
- [ ] **15. SVG最適化** - React コンポーネント化

### パフォーマンス
- [ ] **21. React.memo** - 再レンダリング 防止
- [ ] **22. Virtual List** - 大量リスト処理
- [ ] **23. Lazy Loading** - 画像遅延読み込み
- [ ] **24. SVG化** - アイコン再利用
- [ ] **25. コード削減** - 冗長コード除去
- [ ] **26. useCallback/useMemo** - 関数・値最適化
- [ ] **27. CSSアニメーション** - 軽量化
- [ ] **28. 不要なState/Effect** - 削除

### 状態管理
- [ ] **31. Redux/Zustand** - グローバルState
- [ ] **32. useReducer ** - 複雑State
- [ ] **33. API統合** - fetch/axios
- [ ] **34. Suspense/React Query** - 非同期管理
- [ ] **36. Controlled Component** - フォーム統一
- [ ] **37. Context活用** - Props Drilling回避
- [ ] **38. エラー表示** - State管理
- [ ] **39. StateReset** - ページ遷移時

### テスト・品質
- [ ] **41. ユニットテスト** - Jest + Testing Library
- [ ] **42. Storybook** - コンポーネント カタログ
- [ ] **43. 型安全** - TypeScript strict
- [ ] **44. ESLint/Prettier** - コード統一
- [ ] **45. アクセシビリティ** - ARIA属性追加
- [ ] **46. CSS命名規則** - BEM形式
- [ ] **48. 脆弱性チェック** - npm audit

### 機能・構成
- [ ] **51. フォルダ構成整理** - 論理的チームBased
- [ ] **52. shared/components** - 共通パーツ集約
- [ ] **53. CSSテーマ設定** - globals化
- [ ] **54. デザインガイド実装** - Figma sync
- [ ] **55. グローバルCSS最小化** - Tailwind活用
- [ ] **56. Layout Component** - 統一構造
- [ ] **57. React Router** - ページ遷移管理
- [ ] **58. Code Splitting** - 遅延読み込み

## 🎯 優先順位別実装順序

### Phase 1: 基盤 (✅ 完了)
- Atomic Design構造
- 型定義・テーマ
- コンポーネント実装

### Phase 2: Core機能 (⏳ 次)
1. React Router導入
2. 認証機能実装
3. Global State管理

### Phase 3: 最適化
1. パフォーマンス最適化
2. テスト実装
3. アクセシビリティ改善

### Phase 4: 完成
1. Storybook
2. CI/CD
3. デプロイ準備

---

## 更新日時
- **初回** - 2026-02-15
- **最終更新** - 2026-02-15
