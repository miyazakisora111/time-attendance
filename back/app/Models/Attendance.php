<?php

declare(strict_types=1);

namespace App\Models;

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
    ];

    /**
     * Casts
     */
    protected $casts = [
        'work_date' => 'date',
        'start_time' => 'string',
        'end_time' => 'string',
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
        return $this->start_time !== null;
    }

    /**
     * 退勤済み判定
     */
    public function isClockedOut(): bool
    {
        return $this->end_time !== null;
    }

    /**
     * 勤務中判定
     */
    public function isWorking(): bool
    {
        return $this->start_time !== null && $this->end_time === null;
    }
}