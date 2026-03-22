<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class OvertimeRequest extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'overtime_requests';

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
        'status',
        'approved_by',
        'approved_at',
        'reason',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'work_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Status
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_RETURNED = 'returned';
    public const STATUS_CANCELED = 'canceled';

    /**
     * User relation
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 承認者
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scope: ユーザー
     */
    public function scopeUser(Builder $query, string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope: 承認済み
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope: 申請中
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope: 日付
     */
    public function scopeDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('work_date', $date);
    }

    /**
     * 残業時間（分）
     */
    public function getDurationMinutes(): int
    {
        $start = Carbon::parse($this->start_time);
        $end = Carbon::parse($this->end_time);

        return $end->diffInMinutes($start);
    }

    /**
     * 残業時間（時間）
     */
    public function getDurationHours(): float
    {
        return round($this->getDurationMinutes() / 60, 2);
    }

    /**
     * 承認済み判定
     */
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * 申請中判定
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * 差し戻し
     */
    public function isReturned(): bool
    {
        return $this->status === self::STATUS_RETURNED;
    }

    /**
     * キャンセル
     */
    public function isCanceled(): bool
    {
        return $this->status === self::STATUS_CANCELED;
    }
}
