<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * ユーザーのモデル
 */
class User extends Authenticatable implements JWTSubject
{
    use Notifiable;
    use SoftDeletes;

    /**
     * {@inheritdoc}
     */
    protected $table = 'users';

    /**
     * {@inheritdoc}
     */
    protected $keyType = 'string';

    /**
     * {@inheritdoc}
     */
    public $incrementing = false;

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'department_id',
        'role_id',
        'name',
        'sort_order',
        'email',
        'password',
        'email_verified_at',
        'last_login_at',
    ];

    /**
     * {@inheritdoc}
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'sort_order' => 'integer',
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * {@inheritdoc}
     */
    protected static function booted(): void
    {
        static::creating(function (self $model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * ユーザーに紐づく部署
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * ユーザーに紐づく役職
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * ユーザーに紐づく設定
     */
    public function userSetting(): HasOne
    {
        return $this->hasOne(UserSetting::class);
    }

    /**
     * ユーザーに紐づく通知設定
     */
    public function userNotificationSetting(): HasOne
    {
        return $this->hasOne(UserNotificationSetting::class);
    }

    /**
     * ユーザーに紐づく勤怠
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * ユーザーに紐づくログイン履歴
     */
    public function loginHistories(): HasMany
    {
        return $this->hasMany(LoginHistory::class);
    }

    /**
     * ユーザーに紐づく有給付与
     */
    public function paidLeaveGrants(): HasMany
    {
        return $this->hasMany(PaidLeaveGrant::class);
    }

    /**
     * 部署で絞り込む
     */
    public function scopeForDepartment(Builder $query, string $departmentId): Builder
    {
        return $query->where('department_id', $departmentId);
    }

    /**
     * 表示順で並べる
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    /**
     * メール認証済み判定
     */
    public function isEmailVerified(): bool
    {
        return $this->email_verified_at !== null;
    }

    /**
     * {@inheritdoc}
     */
    public function getJWTIdentifier(): string
    {
        return (string) $this->getKey();
    }

    /**
     * {@inheritdoc}
     */
    public function getJWTCustomClaims(): array
    {
        return [];
    }
}
