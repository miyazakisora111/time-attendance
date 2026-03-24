<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserNotificationSetting extends Model
{
    use HasFactory;

    protected $table = 'user_notification_settings';

    /**
     * UUID primary key
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignment
     */
    protected $fillable = [
        'user_id',
        'clock_in_reminder',
        'leave_reminder',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'clock_in_reminder' => 'boolean',
        'leave_reminder' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * User relation (belongsTo)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
