<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Ramsey\Collection\Collection;

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
        'break_start',
        'break_end',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'break_start' => 'string',
        'break_end' => 'string',
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
        return $this->break_start !== null && $this->break_end === null;
    }

    /**
     * 終了済み判定
     */
    public function isFinished(): bool
    {
        return $this->break_end !== null;
    }

    /**
     * 休憩の長さ（分）を返す
     */
    public function breakMinutes(): int
    {
        $startAt = CarbonImmutable::createFromFormat('H:i:s', $this->break_start);
        $endAt = CarbonImmutable::createFromFormat('H:i:s', $this->break_end);
        $diff = $startAt->diffInMinutes($endAt, false);

        return $diff >= 0 ? $diff : $diff + 24 * 60;
    }

    /**
     * 合計休憩の長さ（分）を返す
     * 
     * @param Collection<AttendanceBreak> $attendanceBreaks 勤怠休憩のコレクション
     * @return int 合計休憩の長さ（分）
     */
    public static function totalBreakMinutes(Collection $attendanceBreaks): int
    {
        return $attendanceBreaks->sum(fn(AttendanceBreak $break) => $break->breakMinutes());
    }
}
