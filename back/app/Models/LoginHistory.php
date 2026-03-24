<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LoginHistory extends BaseModel
{
    use HasFactory;

    protected $table = 'login_histories';

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
     * Scope: ログイン中
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('logged_out_at');
    }

    /**
     * Scope: 新しい順
     */
    public function scopeLatestLogin(Builder $query): Builder
    {
        return $query->orderByDesc('logged_in_at');
    }

    /**
     * ログイン中か判定
     */
    public function isActive(): bool
    {
        return $this->logged_out_at === null;
    }
}
