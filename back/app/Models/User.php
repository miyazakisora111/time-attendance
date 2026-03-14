<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements JWTSubject
{
    use SoftDeletes;

    protected $table = 'users';

    /**
     * UUID primary key
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignment
     */
    protected $fillable = [
        'id',
        'department_id',
        'role_id',
        'name',
        'sort_order',
        'email',
        'password',
        'status',
        'email_verified_at',
        'last_login_at',
    ];

    /**
     * Hidden attributes
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'sort_order' => 'integer',
        'status' => 'boolean',
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * UUID自動生成
     */
    protected static function booted(): void
    {
        static::creating(function (User $user) {

            if (!$user->id) {
                $user->id = (string) Str::uuid();
            }

            if ($user->password) {
                $user->password = Hash::make($user->password);
            }
        });

        static::updating(function (User $user) {

            if ($user->isDirty('password')) {
                $user->password = Hash::make($user->password);
            }
        });
    }

    /**
     * 部署
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * 役職
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function userSetting()
    {
        return $this->hasOne(UserSetting::class);
    }

    public function userNotificationSetting()
    {
        return $this->hasOne(UserNotificationSetting::class);
    }

    /**
     * 有効ユーザー
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 1);
    }

    /**
     * 並び順
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    /**
     * メール検索
     */
    public function scopeEmail(Builder $query, string $email): Builder
    {
        return $query->where('email', $email);
    }

    public function getJWTIdentifier(): string
    {
        return (string) $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }
}
