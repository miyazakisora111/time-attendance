<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ユーザー通知設定のモデル
 */
class UserNotificationSetting extends BaseModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'user_notification_settings';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'user_id',
        'clock_in_reminder',
        'leave_reminder',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'clock_in_reminder' => 'boolean',
        'leave_reminder' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 通知設定に紐づくユーザー
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
