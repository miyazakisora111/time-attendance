<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AttendanceStatus;
use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasUuid;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'work_date',
        'status',
        'total_work_minutes',
        'total_break_minutes',
    ];

    protected $casts = [
        'work_date' => 'date',
        'status' => AttendanceStatus::class,
        'total_work_minutes' => 'integer',
        'total_break_minutes' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeByUser($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByDate($query, \DateTimeInterface $date)
    {
        return $query->whereDate('work_date', $date);
    }

    public function scopeByDateRange($query, \DateTimeInterface $startDate, \DateTimeInterface $endDate)
    {
        return $query->whereBetween('work_date', [$startDate, $endDate]);
    }
}
