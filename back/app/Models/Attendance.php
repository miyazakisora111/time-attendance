<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'note',
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
}
