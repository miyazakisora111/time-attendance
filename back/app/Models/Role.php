<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Role extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'roles';

    /**
     * UUID primary key
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignment
     */
    /** 承認可能な最低レベル */
    public const APPROVER_LEVEL = 3;

    protected $fillable = [
        'id',
        'name',
        'sort_order',
        'level',
        'status',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'sort_order' => 'integer',
        'level' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot (UUID自動生成)
     */
    protected static function booted(): void
    {
        static::creating(function (Role $role) {
            if (!$role->id) {
                $role->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Scope: 有効な役職
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: 表示順
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    /**
     * 承認権限を持つレベルか判定する。
     */
    public function isApproverLevel(): bool
    {
        return $this->level >= self::APPROVER_LEVEL;
    }
}
