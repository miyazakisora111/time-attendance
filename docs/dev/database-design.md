# データベース設計方針

## 基本方針

- RDBMS: **PostgreSQL 15**
- ORM: **Eloquent**（Laravel）
- マイグレーション管理: Laravel Migrations

## 主キー

- すべてのテーブルで **UUID** を主キーとする
- PostgreSQL の `gen_random_uuid()` で生成
- Laravel 側では `HasUuid` トレイトが `Str::uuid()` で自動設定

```php
// マイグレーション
$table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
```

UUID を使う理由:
- 分散環境でのID衝突回避
- URLに含めても推測困難（セキュリティ）
- マイクロサービス移行時の互換性

## タイムスタンプ

- すべてのタイムスタンプカラムは **タイムゾーン付き** (`timestampsTz()`) を使用する
- 勤怠管理ではタイムゾーンが重要であるため、`timestamp` ではなく `timestampTz` を使用する

```php
$table->timestampsTz();
$table->softDeletesTz();
```

## ソフトデリート

- ユーザーや勤怠記録など、監査証跡が必要なテーブルには `softDeletesTz()` を適用する
- 物理削除は原則行わない

## インデックス命名規則

```
idx_{テーブル名}_{カラム名}
```

例:
```php
$table->index('department_id', 'idx_users_department_id');
$table->unique(['user_id', 'date'], 'uq_attendances_user_date');
```

## 外部キー

- `constrained()` で外部キー制約を設定する
- 親レコード削除時の動作を明示する

```php
// 親が削除されたら子も削除
$table->foreignUuid('team_id')->constrained()->cascadeOnDelete();

// 親が削除されたら null にする
$table->foreignUuid('department_id')->nullable()->constrained()->nullOnDelete();
```

## カラム命名規則

| パターン | 規則 | 例 |
|---|---|---|
| 通常カラム | snake_case | `first_name`, `total_minutes` |
| 外部キー | `{テーブル単数}_id` | `user_id`, `team_id` |
| 日時 | `{動詞}_at` | `clocked_in_at`, `approved_at` |
| 真偽値 | `is_{形容詞}` | `is_active`, `is_approved` |
| ステータス | `status` or `{名詞}_status` | `status`, `approval_status` |

## 日跨ぎ勤務の設計

勤怠管理特有の課題として、日跨ぎシフト（深夜勤務など）の扱いがある。
設計の詳細は `database/ATTENDANCE_CROSS_DAY_DESIGN.md` を参照。

## マイグレーションのルール

- マイグレーション名は内容が明確にわかるようにする: `create_attendance_records_table`
- 本番デプロイ後のマイグレーションは変更禁止。新しいマイグレーションで対応する
- `down()` メソッドは必ず実装する（ロールバック可能にする）
- シーダーはテスト用データの投入のみ。本番データの投入には使わない
