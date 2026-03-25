<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;

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
     * 勤怠に紐づくユーザー
     * 
     * @return BelongsTo ユーザーのリレーション
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 勤怠に紐づく勤務休憩
     * 
     * @return HasMany 勤怠休憩のリレーション
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
     * 指定されたローカルタイムゾーンで打刻情報を返す。
     *
     * OpenAPI AttendanceResponse スキーマに準拠したキー名（camelCase）で返す。
     *
     * @return array<string, mixed>
     */
    public function toLocalTimePayload(): array
    {
        $timezone = $this->work_timezone ?? config('app.timezone');

        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'workDate' => $this->work_date?->toDateString(),
            'clockStatus' => $this->resolveClockStatus(),
            'clockInAt' => $this->clock_in_at?->setTimezone($timezone)->toIso8601String(),
            'clockOutAt' => $this->clock_out_at?->setTimezone($timezone)->toIso8601String(),
            'breakMinutes' => $this->break_minutes,
            'workedMinutes' => $this->worked_minutes,
        ];
    }
}
