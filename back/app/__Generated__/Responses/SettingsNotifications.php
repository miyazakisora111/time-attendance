<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

/**
 * 通知設定
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class SettingsNotifications
{
    public function __construct(
        public bool $clockInReminder,
        public bool $leaveReminder,
    ) {}
}
