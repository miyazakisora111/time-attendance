# フロントエンドアーキテクチャ

## 技術スタック

| 分類 | ライブラリ |
|---|---|
| UI フレームワーク | React 19 |
| 言語 | TypeScript (strict) |
| ビルド | Vite |
| ルーティング | React Router v7 |
| 状態管理 | Zustand + React Query |
| フォーム | React Hook Form + Zod |
| スタイリング | Tailwind CSS 4 + CVA |
| HTTP | Axios |
| API クライアント生成 | Orval |

## ディレクトリ設計思想

### 依存方向の制約

```
features/ → shared/ → lib/
              ↓
           domain/
```

- `features/` は `shared/` と `lib/` に依存してよい
- `shared/` は `lib/` にのみ依存してよい
- `lib/` は外部ライブラリにのみ依存する
- 逆方向の依存は禁止

### Feature モジュール構成

```
features/{featureName}/
├── hooks/     # React Query フック、カスタムフック
├── state/     # Zustand ストア
└── ui/        # ページコンポーネント
```

## 状態管理戦略

### サーバー状態 → React Query

API から取得するデータはすべて React Query で管理する。

```typescript
// staleTime: 5分、リトライ: 5xx は最大 3 回、4xx はリトライしない
```

### クライアント状態 → Zustand

認証状態など UI のみで必要な即座の同期は Zustand で管理する。

```typescript
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
}));
```

### 使い分けの判断基準

| データの性質 | 管理先 |
|---|---|
| API レスポンス | React Query |
| 認証トークン | localStorage + Zustand |
| フォーム状態 | React Hook Form |
| UI 一時状態 | useState / useReducer |
| グローバルエラー | Context |

## API 統合パターン

### 3 層構造

```
__generated__/    自動生成された React Query フック
    ↓
api/*.api.ts      Result<T> パターンでラップ
    ↓
lib/http/client   Axios インスタンス + トークン管理
```

### Result 型

```typescript
type Result<T> = Ok<T> | Err;

// 使用例
const result = await fetchAuthMe();
if (result.ok) {
  // result.data: User
} else {
  // result.error: ApiError
}
```

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
| フォーム | `Form`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Textarea` |
| ボタン | `Button`, `SubmitButton`, `ClockActionButtons` |
| レイアウト | `Container`, `PrivateLayout`, `PublicLayout` |
| カード | `Card`, `CardHeader`, `CardTitle`, `CardContent` |
| 表示 | `Typography`, `Badge`, `Clock`, `Spinner`, `IconWrapper` |
| エラー | `ErrorModal`, `Error` |

### Feature コンポーネント

各 feature の `ui/` ディレクトリにページレベルのコンポーネントを配置する。共有コンポーネントを組み合わせて構築する。
