<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

/** 
 * 勤怠休憩のモデル 
 */
class AttendanceBreak extends BaseModel
{
    use SoftDeletes;

    /**
     * {@inheritdoc}
     */
    protected $table = 'attendance_breaks';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'attendance_id',
        'break_start_at',
        'break_end_at',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'break_start_at' => 'string',
        'break_end_at' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * 勤怠休憩に紐づく勤怠
     * 
     * @return BelongsTo 勤怠のリレーション
     */
    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }

    /**
     * 休憩中判定
     */
    public function isBreaking(): bool
    {
        return $this->break_start_at !== null && $this->break_end_at === null;
    }

    /**
     * 終了済み判定
     */
    public function isBreakFinished(): bool
    {
        return $this->break_end_at !== null;
    }

    /**
     * 勤怠で絞り込む
     */
    public function scopeForAttendance(Builder $query, string $attendanceId): Builder
    {
        return $query->where('attendance_id', $attendanceId);
    }

    /**
     * 休憩の長さ（分）を返す
     */
    public function breakMinutes(): int
    {
        $breakStartAt = CarbonImmutable::createFromFormat('H:i:s', $this->break_start_at);
        $breakEndAt = CarbonImmutable::createFromFormat('H:i:s', $this->break_end_at);
        $diff = $breakStartAt->diffInMinutes($breakEndAt, false);

        return $diff >= 0 ? $diff : $diff + 24 * 60;
    }
}
