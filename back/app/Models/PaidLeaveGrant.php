<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaidLeaveGrant extends Model
{
    use HasFactory;

    protected $table = 'paid_leave_grants';

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
        'days',
        'granted_at',
        'expires_at',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'days' => 'float',
        'granted_at' => 'date',
        'expires_at' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * ユーザー
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
     * Scope: 有効な付与
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now());
        });
    }

    /**
     * Scope: 有効期限順
     */
    public function scopeExpireOrder(Builder $query): Builder
    {
        return $query->orderBy('expires_at');
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
