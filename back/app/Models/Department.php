<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

/**
 * 部署のモデル
 */
class Department extends BaseModel
{
    use SoftDeletes;

    /**
     * {@inheritdoc}
     */
    protected $table = 'departments';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'name',
        'sort_order',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * 部署に紐づくユーザー
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * 表示順で並べる
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }
}
