<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attendance extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'attendances';

    /**
     * UUID primary key
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignment
     */
    protected $fillable = [
        'user_id',
        'work_date',
        'start_time',
        'end_time',
        'clock_in_at',
        'clock_out_at',
        'work_timezone',
        'break_minutes',
        'worked_minutes',
        'note',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'work_date' => 'immutable_date',
        'start_time' => 'string',
        'end_time' => 'string',
        'clock_in_at' => 'immutable_datetime',
        'clock_out_at' => 'immutable_datetime',
        'break_minutes' => 'integer',
        'worked_minutes' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * User relation
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: 特定ユーザー
     */
    public function scopeUser(Builder $query, string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope: 特定日
     */
    public function scopeWorkDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('work_date', $date);
    }

    /**
     * Scope: 月検索
     */
    public function scopeMonth(Builder $query, int $year, int $month): Builder
    {
        return $query
            ->whereYear('work_date', $year)
            ->whereMonth('work_date', $month);
    }

    /**
     * 出勤済み判定
     */
    public function isClockedIn(): bool
    {
        return $this->clock_in_at !== null || $this->start_time !== null;
    }

    /**
     * 退勤済み判定
     */
    public function isClockedOut(): bool
    {
        return $this->clock_out_at !== null || $this->end_time !== null;
    }

    /**
     * 勤務中判定
     */
    public function isWorking(): bool
    {
        return $this->isClockedIn() && !$this->isClockedOut();
    }

    /**
     * 日跨ぎ勤務かどうかを判定する。
     */
    public function isCrossDayShift(): bool
    {
        if ($this->clock_in_at === null || $this->clock_out_at === null) {
            return false;
        }

        $timezone = $this->work_timezone ?? config('app.timezone', 'Asia/Tokyo');

        return !$this->clock_in_at->setTimezone($timezone)->isSameDay(
            $this->clock_out_at->setTimezone($timezone)
        );
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
     * @return array<string, mixed>
     */
    public function toLocalTimePayload(): array
    {
        $timezone = $this->work_timezone ?? config('app.timezone', 'Asia/Tokyo');

        $clockInLocal = $this->clock_in_at?->setTimezone($timezone)->format('H:i')
            ?? (is_string($this->start_time) ? substr($this->start_time, 0, 5) : null);

        $clockOutLocal = $this->clock_out_at?->setTimezone($timezone)->format('H:i')
            ?? (is_string($this->end_time) ? substr($this->end_time, 0, 5) : null);

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'work_date' => $this->work_date?->toDateString(),
            'work_timezone' => $timezone,
            'clock_in_at' => $this->clock_in_at?->setTimezone($timezone)->toIso8601String(),
            'clock_out_at' => $this->clock_out_at?->setTimezone($timezone)->toIso8601String(),
            'clock_in_local_time' => $clockInLocal,
            'clock_out_local_time' => $clockOutLocal,
            // OpenAPI spec 互換（フロントエンドが参照するフィールド）
            'start_time' => $clockInLocal,
            'end_time' => $clockOutLocal,
            'clock_out_next_day' => $this->isCrossDayShift(),
            'break_minutes' => $this->break_minutes,
            'worked_minutes' => $this->worked_minutes,
            'note' => $this->note,
        ];
    }
}
