# フロントエンドアーキテクチャ

## 技術スタック

| 分類 | ライブラリ | バージョン |
|---|---|---|
| UI フレームワーク | React | 19.2 |
| 言語 | TypeScript (strict) | 5.9 |
| ビルド | Vite | 8.0 beta |
| ルーティング | React Router | v7.13 |
| サーバー状態 | TanStack React Query | v5.90 |
| クライアント状態 | Zustand | v5.0 |
| フォーム | React Hook Form + Zod | RHF 7.71 / Zod 4.3 |
| スタイリング | Tailwind CSS 4 + CVA | TW 4.2 / CVA 0.7 |
| HTTP | Axios | 1.13 |
| API クライアント生成 | Orval | — |
| アニメーション | Framer Motion | 12.35 |
| トースト | Sonner | 2.0 |
| アイコン | Lucide React | 0.575 |

> **注意**: Vite 8 は beta 版。安定版リリースまでに Vite 7 系へのダウングレードを検討すること。

## ディレクトリ設計

```
front/src/
├── app/                  # AppRoutes.tsx, AppProviders.tsx
├── features/             # 機能モジュール（6機能）
│   ├── auth/             # hooks/, ui/
│   ├── attendance/       # hooks/, mappers/, ui/
│   ├── dashboard/        # hooks/, ui/
│   ├── schedule/         # hooks/, ui/
│   ├── settings/         # hooks/, ui/
│   └── team/             # hooks/, ui/
├── shared/               # 汎用コンポーネント・デザインシステム
│   ├── components/       # Button, Card, Typography, layouts
│   ├── design-system/    # tokens, variants, CVA 定義
│   ├── constants/        # 定数
│   ├── contexts/         # ErrorContext
│   ├── hooks/            # useCurrentTime 等
│   └── utils/            # cn(), formatDate() 等
├── domain/               # ドメイン型・純関数
│   └── attendance/       # attendance.ts (状態判定, 時間計算)
├── api/                  # 生成クライアントの call() ファサード
├── lib/
│   ├── http/             # Axios インスタンス, Result<T>, ApiError
│   └── query/            # React Query keys, client 設定
├── config/               # api.ts, auth.ts, routes.ts, constants.ts
└── __generated__/        # OpenAPI 自動生成（編集禁止）
    ├── *.ts              # モデル型（60+ファイル）
    ├── enums.ts          # Enum 定義
    ├── zod.ts            # Zod スキーマ
    └── zod.validation.ts # バリデーション用 Zod スキーマ
```

### 依存方向の制約

```
features/ → shared/ → lib/ → config/
              ↓
           domain/
```

逆方向の依存は禁止。feature 間の直接依存も禁止。

## 状態管理戦略

### サーバー状態 → React Query

API から取得するデータはすべて React Query で管理する。

| 設定 | 値 |
|---|---|
| staleTime | 5分 |
| リトライ | 5xx: 最大3回 / 4xx: リトライなし |
| refetchOnWindowFocus | true |

### クライアント状態 → Zustand（認証のみ）

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (v: boolean) => void;
  logout: () => void;
}
```

> **⚠️ 既知の問題**: 認証状態が React Query と Zustand の二重管理になっている。`useAuth()` は React Query から取得し `useEffect` で Zustand に同期するが、同期前のレンダーで不整合が起きる。将来的に一方に統一すべき。

### 使い分けの判断基準

| データの性質 | 管理先 |
|---|---|
| API HTTPレスポンス | React Query |
| 認証トークン | localStorage + Zustand |
| フォーム状態 | React Hook Form |
| UI 一時状態 | useState / useReducer |
| グローバルエラー | ErrorContext |

## API 統合パターン

### 3 層構造

```
__generated__/*.ts    OpenAPI → Orval 自動生成（型 + React Query hooks）
    ↓
api/*.api.ts          call() / callResult() で Result<T> パターンにラップ
    ↓
lib/http/client.ts    Axios インスタンス + JWT トークン管理 + エラーインターセプター
```

### Result 型

```typescript
type Result<T> = Ok<T> | Err;

const result = await callResult(fetchAuthMe);
if (result.ok) {
  // result.data: User
} else {
  // result.error: ApiError
}
```

### Mapper パターン

API HTTPレスポンスから UI 表示用の型に変換する。

```typescript
// features/attendance/mappers/toAttendanceView.ts
export function toAttendanceView(attendance: AttendanceResponse): AttendanceView {
  return {
    id: attendance.id,
    date: formatDate(attendance.workDate),
    totalWorkedMs: calculateWorkedMinutes(attendance), // ⚠️ 実際は「分」
    // ...
  };
}
```

> **⚠️ 命名バグ**: `totalWorkedMs` は「ミリ秒」を意味する名前だが実際は「分」の値が入る。`totalWorkedMinutes` にリネームすべき。

## ルーティング

```
/login          → PublicLayout  → LoginPage
/dashboard      → PrivateLayout → DashboardPage
/attendance     → PrivateLayout → AttendancePage
/schedule       → PrivateLayout → SchedulePage
/team           → PrivateLayout → TeamPage
/settings       → PrivateLayout → SettingsPage
```

- 未認証時: `/login` 以外は `/login` にリダイレクト
- 認証済み時: `/login` は `/dashboard` にリダイレクト

## コンポーネント設計

### 共有コンポーネント (`shared/components/`)

| カテゴリ | コンポーネント |
|---|---|
| レイアウト | `Container`, `PrivateLayout`, `PublicLayout`, `Sidebar` |
| カード | `Card`, `CardHeader`, `CardTitle`, `CardContent` |
| フォーム | `Form`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Textarea` |
| ボタン | `Button`, `SubmitButton` |
| 表示 | `Typography`, `Badge`, `Clock`, `Spinner`, `IconWrapper`, `EmptyState` |
| エラー | `ErrorModal` |

### Feature コンポーネント命名

各 feature の `ui/` にページコンポーネントを配置する。

> **⚠️ 命名不整合**: `DashBoardPage` (大文字B) と `DashboardPage` (小文字b) が混在。PascalCase（`DashboardPage`）に統一すべき。

## 設計レビュー指摘事項

| 区分 | 指摘 |
|---|---|
| 🚨 問題 | `__generated__/enums.ts` のテンプレート (`{{ name }}`, `{{ cases }}`) が未展開。ビルド不可 |
| 🚨 問題 | `<ErrorBoundary>` が未配置。レンダーエラーで全画面ホワイトアウトする |
| 🚨 問題 | ログイン失敗時の UI フィードバックがない（401 インターセプターがトーストを表示しない） |
| 🚨 問題 | `PrivateLayout` のユーザー情報がハードコード `{ name: "TODO", email: "taro@example.com" }` |
| 💡 改善 | Auth の二重状態管理（React Query + Zustand）を一方に統一すべき |
| 💡 改善 | 休憩ボタンが UI に表示されるが「未実装」トーストを返すのみ。非表示にするか実装すべき |
| 💡 改善 | `react-error-boundary` は依存に含まれているので `<ErrorBoundary>` を App.tsx に追加するだけ |
| ⚠️ アンチパターン | `console.error` が本番環境でもHTTPリクエスト/HTTPレスポンス全体を出力。`import.meta.env.DEV` でガードすべき |
| ⚠️ アンチパターン | `record.status as never` で TypeScript の型チェックをバイパスしている箇所がある |
| ⚠️ アンチパターン | `index.html` の `lang="en"` — 日本語アプリなので `lang="ja"` にすべき |
| ⚠️ アンチパターン | 本番ビルドで `sourcemap: true`。ソースコードが露出する |
