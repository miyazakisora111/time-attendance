<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Traits\HasUuid;
use App\Models\Observers\UserObserver;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * User Model
 * 
 * ユーザー情報を表すEloquentモデル。
 * PHP 8.2の属性とreadonly prototypeを活用。
 */
#[ObservedBy([UserObserver::class])]
class User extends Model
{
    use HasUuid;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'department',
        'position',
        'status',
        'metadata',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'id' => 'string',
        'status' => UserStatus::class,
        'metadata' => 'json',
        'last_login_at' => 'datetime',
        'email_verified_at' => 'datetime',
    ];

    protected $keyType = 'string';

    public $incrementing = false;

    /**
     * アクティブなユーザーのスコープ
     */
    public function scopeActive($query)
    {
        return $query->where('status', UserStatus::ACTIVE->value);
    }

    /**
     * 非アクティブなユーザーのスコープ
     */
    public function scopeInactive($query)
    {
        return $query->where('status', UserStatus::INACTIVE->value);
    }

    /**
     * メールアドレスで検索
     */
    public function scopeByEmail($query, string $email)
    {
        return $query->where('email', strtolower($email));
    }

    /**
     * 最後のログイン日時を更新
     */
    public function recordLogin(): void
    {
        $this->update(['last_login_at' => now()]);
    }

    /**
     * ユーザーをアクティベート
     */
    public function activate(): void
    {
        if ($this->status->canActivate()) {
            $this->update(['status' => UserStatus::ACTIVE]);
        }
    }

    /**
     * ユーザーを非アクティブ化
     */
    public function deactivate(): void
    {
        $this->update(['status' => UserStatus::INACTIVE]);
    }

    /**
     * ユーザーを一時停止
     */
    public function suspend(): void
    {
        $this->update(['status' => UserStatus::SUSPENDED]);
    }

    /**
     * メタデータを取得または設定
     */
    public function getMeta(string $key, mixed $default = null): mixed
    {
        return data_get($this->metadata ?? [], $key, $default);
    }

    public function setMeta(string $key, mixed $value): self
    {
        $metadata = $this->metadata ?? [];
        data_set($metadata, $key, $value);
        $this->metadata = $metadata;
        return $this;
    }

    /**
     * ユーザーが管理者かを判定
     */
    public function isAdmin(): bool
    {
        return $this->getMeta('is_admin', false) === true;
    }
}
