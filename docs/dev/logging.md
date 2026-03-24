# ログ設計

## バックエンド（Laravel）

### ログチャンネル

`config/logging.php` で定義。API HTTPリクエスト用のカスタムチャンネルを使用する。

### 構造化 JSON ログ

すべてのログは JSON 形式で出力され、以下のフィールドを自動付与する:

| フィールド | 説明 |
|---|---|
| `request_id` | HTTPリクエスト固有のトレーシングID |
| `user_id` | 認証済みユーザーの ID（未認証時は null） |
| `ip` | クライアント IP アドレス |
| `user_agent` | ブラウザ / クライアント情報 |
| `timestamp` | ログ出力時刻 |
| `level` | ログレベル |
| `message` | メッセージ |
| `context` | 追加コンテキスト（配列） |

### ログ出力例

```json
{
  "timestamp": "2026-03-21T10:00:00+09:00",
  "level": "info",
  "message": "打刻処理完了",
  "request_id": "abc123",
  "user_id": "uuid-xxx",
  "ip": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "context": {
    "action": "clock_in",
    "attendance_id": "uuid-yyy"
  }
}
```

### ログレベルの使い分け

| レベル | 用途 |
|---|---|
| `debug` | 開発時のデバッグ情報（本番では無効化） |
| `info` | 正常な業務処理の記録 |
| `warning` | 4xx エラー、想定内の異常 |
| `error` | 5xx エラー、想定外の異常（スタックトレース付き） |
| `critical` | システム障害、即時対応が必要 |

### Service でのログ出力

```php
// BaseService のヘルパーメソッドを使う
$this->log('info', '打刻処理開始', ['user_id' => $userId]);
$this->logError('打刻処理失敗', $exception, ['user_id' => $userId]);
```

### API HTTPリクエストログ

`LogApiRequest` ミドルウェアがすべての API HTTPリクエストを自動ログする:

- HTTPリクエスト: メソッド、URL、パラメータ
- HTTPレスポンス: HTTPステータスコード、処理時間

### ログに含めてはいけない情報

- パスワード（平文・ハッシュ問わず）
- JWT トークン
- クレジットカード番号
- 個人情報（必要最小限に留める）

## フロントエンド

- 本番コードに `console.log` を残さない
- エラーは `ErrorContext` を通じてユーザーに通知する
- API エラーは Axios インターセプターで一元的にキャプチャする

## Docker ログ

### 開発環境

```bash
make logs      # 全コンテナのログ（tail 200行）
```

### 本番環境

`docker-compose.prod.yml` で JSON ファイルログを設定:

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```
