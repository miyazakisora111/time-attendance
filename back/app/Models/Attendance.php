<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\Timezone;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\CarbonImmutable;

/** 
 * 勤怠のモデル 
 */
class Attendance extends BaseModel
{
    use SoftDeletes;
    use Timezone;

    /**
     * {@inheritdoc}
     */
    protected $table = 'attendances';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'user_id',
        'work_date',
        'clock_in_at',
        'clock_out_at',
        'work_timezone',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'work_date' => 'immutable_date',
        'clock_in_at' => 'immutable_datetime',
        'clock_out_at' => 'immutable_datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * 勤怠に紐づくユーザー
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 勤怠に紐づく勤務休憩
     */
    public function breaks(): HasMany
    {
        return $this->hasMany(AttendanceBreak::class);
    }

    /**
     * 出勤済みを判定する
     */
    public function isClockedIn(): bool
    {
        return $this->clock_in_at !== null;
    }

    /**
     * 退勤済みを判定する
     */
    public function isClockedOut(): bool
    {
        return $this->clock_out_at !== null;
    }

    /**
     * 勤務時間（分）を算出する。
     *
     * @return int 勤務時間（分）
     */
    public function workMinutes(): int
    {
        if (!$this->isClockedIn()) {
            return 0;
        }

        $start = CarbonImmutable::parse($this->clock_in_at);
        $end = $this->isClockedOut()
            ? CarbonImmutable::parse($this->clock_out_at)
            : CarbonImmutable::now($this->work_timezone);

        if ($end->lt($start)) {
            return 0;
        }

        return $end->diffInMinutes($start);
    }

    /**
     * 分数を時間に変換する。
     *
     * @param int $minutes 分数
     * @return float 時間（小数点1桁）
     */
    public function minutesToHours(int $minutes): float
    {
        return round($minutes / 60, 1);
    }
}
