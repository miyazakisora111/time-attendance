<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

/**
 * 有給付与のモデル
 */
class PaidLeaveGrant extends BaseModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'paid_leave_grants';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'user_id',
        'days',
        'granted_at',
        'expires_at',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'days' => 'float',
        'granted_at' => 'immutable_date',
        'expires_at' => 'immutable_date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 有給付与に紐づくユーザー
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ユーザーで絞り込む
     */
    public function scopeForUser(Builder $query, string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * 期限切れ判定
     */
    public function isExpired(): bool
    {
        if ($this->expires_at === null) {
            return false;
        }

        return $this->expires_at->isPast();
    }
}
