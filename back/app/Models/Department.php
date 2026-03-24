<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Department extends BaseModel
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'departments';

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
     * UUID自動生成
     */
    protected static function booted(): void
    {
        static::creating(function (Department $department) {
            if (!$department->id) {
                $department->id = (string) Str::uuid();
            }
        });
    }

    /**
     * 表示順ソート
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }

    /**
     * 名前検索
     */
    public function scopeSearch(Builder $query, ?string $keyword): Builder
    {
        if (!$keyword) {
            return $query;
        }

        return $query->where('name', 'like', "%{$keyword}%");
    }

    /**
     * ユーザーとのリレーション（例）
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
