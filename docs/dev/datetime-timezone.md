# タイムゾーンと日時の扱い

## 勤怠管理における日時の重要性

勤怠管理システムでは日時の正確な扱いが極めて重要である。特に以下のケースで問題が発生しやすい:

- 日跨ぎ勤務（深夜シフト）
- タイムゾーンの異なるユーザー
- 夏時間（DST）

## 基本方針

### データベース

- すべての日時カラムは **タイムゾーン付き** (`timestampTz`) で保存する
- PostgreSQL の `TIMESTAMP WITH TIME ZONE` 型を使用する
- 内部的には UTC で保存される

```php
// マイグレーション
$table->timestampsTz();  // created_at, updated_at
$table->timestampTz('clocked_in_at');
```

### バックエンド（PHP / Laravel）

- `DateTimeImmutable` または `CarbonImmutable` を使用する（ミュータブルな `DateTime` は避ける）
- Eloquent の cast は `immutable_datetime` を使う

```php
protected $casts = [
    'clocked_in_at' => 'immutable_datetime',
    'clocked_out_at' => 'immutable_datetime',
];
```

### フロントエンド

- API HTTPレスポンスの日時は ISO 8601 形式（`2026-03-21T10:00:00+09:00`）
- 表示時にユーザーのタイムゾーンに変換する
- `LanguageCode` Enum で `ja` / `en` の言語切り替えに対応

## 日跨ぎ勤務の設計

詳細は `database/ATTENDANCE_CROSS_DAY_DESIGN.md` を参照。

### 基本的な考え方

- 「勤務日」は出勤打刻の日付に紐づける
- 退勤が翌日になっても、勤務日は出勤日のまま
- 勤務時間の計算は打刻時刻の差分で行う（日付境界を跨いでも正しく計算される）

## 日時フォーマット

### API HTTPレスポンス

| 種類 | フォーマット | 例 |
|---|---|---|
| 日時 | ISO 8601 | `2026-03-21T10:00:00+09:00` |
| 日付のみ | `Y-m-d` | `2026-03-21` |
| 時刻のみ | `H:i` | `10:00` |

### フロントエンド表示

```typescript
// shared/utils/format.ts のユーティリティを使う
formatMinutesToTime(480)    // → "8:00"
formatWorkedHours(480)      // → "8時間00分"
```

## 注意事項

- `new Date()` や `Date.now()` を直接使わず、共通ユーティリティを経由する
- テストでは日時を固定して再現可能にする（`Carbon::setTestNow()` など）
- 日時の比較はタイムゾーンを揃えてから行う
