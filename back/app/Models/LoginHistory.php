<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

/**
 * ログイン履歴のモデル
 */
class LoginHistory extends BaseModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'login_histories';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'logged_in_at',
        'logged_out_at',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'logged_in_at' => 'datetime',
        'logged_out_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * ログイン履歴に紐づくユーザー
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
     * 新しい順で並べる
     */
    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderByDesc('logged_in_at');
    }

    /**
     * ログイン中判定
     */
    public function isActive(): bool
    {
        return $this->logged_out_at === null;
    }
}
