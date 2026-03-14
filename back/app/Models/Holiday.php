<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Holiday extends Model
{
    use HasFactory;

    protected $table = 'holidays';

    /**
     * UUID primary key
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignment
     */
    protected $fillable = [
        'holiday_date',
        'name',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'holiday_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope: 年検索
     */
    public function scopeYear(Builder $query, int $year): Builder
    {
        return $query->whereYear('holiday_date', $year);
    }

    /**
     * Scope: 月検索
     */
    public function scopeMonth(Builder $query, int $year, int $month): Builder
    {
        return $query
            ->whereYear('holiday_date', $year)
            ->whereMonth('holiday_date', $month);
    }

    /**
     * 祝日判定
     */
    public static function isHoliday(string $date): bool
    {
        return static::whereDate('holiday_date', $date)->exists();
    }
}
