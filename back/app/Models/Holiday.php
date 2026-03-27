<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

/**
 * 祝日のモデル
 */
class Holiday extends BaseModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'holidays';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'holiday_date',
        'name',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'holiday_date' => 'immutable_date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 年月で絞り込む
     */
    public function scopeMonth(Builder $query, int $year, int $month): Builder
    {
        return $query
            ->whereYear('holiday_date', $year)
            ->whereMonth('holiday_date', $month);
    }
}
