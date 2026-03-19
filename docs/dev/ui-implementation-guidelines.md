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