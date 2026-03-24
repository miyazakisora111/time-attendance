<?php

declare(strict_types=1);

namespace App\Models;

use App\Exceptions\DomainException;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/** 
 * 勤怠のモデル 
 */
class Attendance extends BaseModel
{
    use SoftDeletes;

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
        'break_minutes',
        'worked_minutes',
        'note',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'work_date' => 'immutable_date',
        'clock_in_at' => 'immutable_datetime',
        'clock_out_at' => 'immutable_datetime',
        'break_minutes' => 'integer',
        'worked_minutes' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * {@inheritdoc}
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * {@inheritdoc}
     */
    public function breaks(): HasMany
    {
        return $this->hasMany(AttendanceBreak::class);
    }

    /**
     * 出勤済みを判定する
     * 
     * @return bool 出勤済みかどうか
     */
    public function isClockedIn(): bool
    {
        return $this->clock_in_at !== null;
    }

    /**
     * 退勤済みを判定する
     * 
     * @return bool 退勤済みかどうか
     */
    public function isClockedOut(): bool
    {
        return $this->clock_out_at !== null;
    }

    /**
     * 退勤可能な状態か検証する。
     *
     * 勤務中('in')のみ退勤を許可する。
     * 休憩中('break')の場合は先に休憩を終了する必要がある。
     *
     * @throws DomainException 退勤不可の状態の場合
     */
    public function assertCanClockOut(): void
    {
        $status = $this->resolveClockStatus();

        match ($status) {
            'in' => null, // OK
            'break' => throw new DomainException('休憩中は退勤できません。先に休憩を終了してください', 'CANNOT_CLOCK_OUT_ON_BREAK'),
            'out' => throw new DomainException('出勤していません', 'NOT_CLOCKED_IN'),
        };
    }

    /**
     * 休憩開始可能な状態か検証する。
     *
     * @throws DomainException 休憩開始不可の状態の場合
     */
    public function assertCanBreakStart(): void
    {
        $status = $this->resolveClockStatus();

        match ($status) {
            'in' => null, // OK
            'break' => throw new DomainException('すでに休憩中です', 'ALREADY_ON_BREAK'),
            'out' => throw new DomainException('出勤していません', 'NOT_CLOCKED_IN'),
        };
    }

    /**
     * 休憩終了可能な状態か検証する。
     *
     * @throws DomainException 休憩終了不可の状態の場合
     */
    public function assertCanBreakEnd(): void
    {
        $status = $this->resolveClockStatus();

        match ($status) {
            'break' => null, // OK
            'in' => throw new DomainException('休憩中ではありません', 'NOT_ON_BREAK'),
            'out' => throw new DomainException('出勤していません', 'NOT_CLOCKED_IN'),
        };
    }

    // ─── 休憩時間の集計 ───────────────────────────

    /**
     * AttendanceBreak レコードから break_minutes を再計算して保存する。
     *
     * 終了済みの休憩レコードすべてを合算する。
     */
    public function recalculateBreakMinutes(): void
    {
        $totalMinutes = 0;

        $completedBreaks = AttendanceBreak::query()
            ->where('attendance_id', $this->id)
            ->whereNotNull('break_start')
            ->whereNotNull('break_end')
            ->get();

        foreach ($completedBreaks as $brk) {
            $start = CarbonImmutable::createFromFormat('H:i:s', $brk->break_start);
            $end = CarbonImmutable::createFromFormat('H:i:s', $brk->break_end);

            if ($start !== false && $end !== false) {
                $diff = $start->diffInMinutes($end, false);
                // 日跨ぎ休憩: end < start の場合は +24h
                if ($diff < 0) {
                    $diff += 24 * 60;
                }
                $totalMinutes += $diff;
            }
        }

        $this->update(['break_minutes' => $totalMinutes]);
    }

    /**
     * 勤務時間(分)を計算する。未退勤の場合は $now を終端として使う。
     */
    public function calculateWorkedMinutes(?CarbonImmutable $now = null): ?int
    {
        if ($this->clock_in_at === null) {
            return null;
        }

        $end = $this->clock_out_at ?? $now;
        if ($end === null || $end->lte($this->clock_in_at)) {
            return null;
        }

        return $this->clock_in_at->diffInMinutes($end);
    }

    /**
     * 指定されたローカルタイムゾーンで打刻情報を返す。
     *
     * OpenAPI AttendanceResponse スキーマに準拠したキー名（camelCase）で返す。
     *
     * @return array<string, mixed>
     */
    public function toLocalTimePayload(): array
    {
        $timezone = $this->work_timezone ?? config('app.timezone', 'Asia/Tokyo');

        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'workDate' => $this->work_date?->toDateString(),
            'clockStatus' => $this->resolveClockStatus(),
            'startTime' => $this->clock_in_at?->setTimezone($timezone)->toIso8601String(),
            'endTime' => $this->clock_out_at?->setTimezone($timezone)->toIso8601String(),
            'breakMinutes' => $this->break_minutes,
            'workedMinutes' => $this->worked_minutes,
        ];
    }
}
