# React + TypeScript 型設計ルール集

## 🧠 基本思想

### 型は「ドキュメント」ではなく「制約」
- コメントやREADMEはズレるが、型はコンパイル時に常に強制される

### 型 = 変更耐性を上げる装置
- 将来の仕様変更時に影響範囲を型エラーで可視化できる

### 外部境界ほど厳密、内部ほど柔軟
- API / URL / Form は変化源。内部まで厳密にすると変更耐性が下がる

### 推論を信じる、明示は境界だけ
- 推論を殺すと冗長になり、修正点が増える

### 曖昧さ（any / undefined）は即排除
- ランタイムバグの温床

---

## 🧱 レイヤー構造

```
[ Domain ]
    ↑
[ Mapper / Application ]
    ↑
[ API / DTO / Zod ]
    ↑
[ UI / Component / Form ]
```

---

## 🧩 Domain

### Domainは純粋な概念定義
- React / Zod / API に依存しない

### UI都合の状態を持たない
- isEditing / isSelected などは禁止

### Domainは不変を前提
- mutable前提は事故を生む

### Derived fieldを持たせない
- 冗長な情報は同期ズレの原因

### IDは type alias で表現
```ts
type UserId = string;
```

### booleanは意味を名前に埋め込む

### Optionalより union type

### enumより union type

---

## 🌐 API / DTO

### APIレスポンス型は必ず分離
```ts
type UserResponse = { user_id: string };
type User = { id: UserId };
```

### snake_caseはそのまま受け取る

### camelCase変換は mapper に集約
```ts
const toUser = (r: UserResponse): User => ({ id: r.user_id });
```

### API型をComponent/Formに渡さない

---

## 🔐 Zod / Validation

### 型はZodから生成
```ts
const schema = z.object({ name: z.string() });
type Input = z.infer<typeof schema>;
```

### Zodは境界専用

---

## ⚛️ Component

### Propsはexportしない

### React.FCは禁止

### JSX内で型アサーション禁止

---

## 🧪 State / Hooks

### undefined state禁止
```ts
useState<User | null>(null);
```

### hookはobjectを返す

---

## 📡 TanStack Query

### useQueryで型指定しない

---

## 🧭 Router / Params

### useParams直使用禁止

---

## 🛠 tsconfig / ESLint

### strict系はすべてtrue

### eslint-disableは理由必須
