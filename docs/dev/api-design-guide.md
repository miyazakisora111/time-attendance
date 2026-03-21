# API 設計ガイド

> OpenAPI 定義の書き方については [open-api.md](./open-api.md) を参照。  
> ここでは API エンドポイントの **設計思想と運用ルール** を扱う。

## 設計原則

### RESTful 設計

| 操作 | HTTP メソッド | URL パターン | 例 |
|---|---|---|---|
| 一覧取得 | GET | `/resources` | `GET /attendance-records` |
| 詳細取得 | GET | `/resources/{id}` | `GET /attendance-records/{id}` |
| 作成 | POST | `/resources` | `POST /attendance-records` |
| 更新 | PUT | `/resources/{id}` | `PUT /attendance-records/{id}` |
| 部分更新 | PATCH | `/resources/{id}` | `PATCH /settings` |
| 削除 | DELETE | `/resources/{id}` | `DELETE /attendance-records/{id}` |
| アクション | POST | `/resources/{id}/action` | `POST /attendance/clock` |

### URL 命名規則

- リソース名は **複数形 kebab-case**: `/attendance-records`（`attendanceRecords` ではない）
- ネストは最大 2 階層: `/teams/{teamId}/members`
- アクション系は動詞を末尾に: `/attendance/clock`

## 統一レスポンス形式

すべてのエンドポイントは同一構造で応答する。

### 成功時

```json
{
  "success": true,
  "message": "打刻が完了しました",
  "data": { ... },
  "meta": null
}
```

### エラー時

```json
{
  "success": false,
  "message": "バリデーションエラー",
  "data": null,
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["メールアドレスは必須です。"]
  }
}
```

### エラーコード一覧

| code | HTTP Status | 意味 |
|---|---|---|
| `VALIDATION_ERROR` | 422 | 入力バリデーション失敗 |
| `DOMAIN_ERROR` | 400 | ビジネスルール違反 |
| `AUTH_ERROR` | 401 | 認証失敗 / トークン無効 |
| `FORBIDDEN_ERROR` | 403 | 権限不足 |
| `NOT_FOUND` | 404 | リソースが見つからない |
| `INTERNAL_ERROR` | 500 | サーバー内部エラー |

## 認証

- JWT Bearer トークンを `Authorization: Bearer {token}` ヘッダーで送信する
- `/login` のみ認証不要。他の全エンドポイントは認証必須
- トークンの有効期限は JWT の `exp` クレームで管理する

## レートリミット

| エンドポイント | 制限 |
|---|---|
| `POST /login` | 5 回 / 分 |
| その他（認証済み） | 60 回 / 分 |

## ページネーション

一覧系エンドポイントでは以下の形式を使う。

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 42,
    "last_page": 3
  }
}
```

## バージョニング

現時点では URL ベースのバージョニングは行わない。破壊的変更が必要になった場合に `/v2/` を検討する。
