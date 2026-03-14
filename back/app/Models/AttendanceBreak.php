<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AttendanceBreak extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'attendance_breaks';

    /**
     * UUID primary key
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignment
     */
    protected $fillable = [
        'attendance_id',
        'break_start',
        'break_end',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'break_start' => 'string',
        'break_end' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * 勤怠
     */
    public function attendance()
    {
        return $this->belongsTo(Attendance::class);
    }

    /**
     * Scope: 勤怠ID
     */
    public function scopeAttendance(Builder $query, string $attendanceId): Builder
    {
        return $query->where('attendance_id', $attendanceId);
    }

    /**
     * 休憩中判定
     */
    public function isBreaking(): bool
    {
        return $this->break_start !== null && $this->break_end === null;
    }

    /**
     * 終了済み判定
     */
    public function isFinished(): bool
    {
        return $this->break_end !== null;
    }
}
