<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Dashboard;

/**
 * 今日の勤怠レコード
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class DashboardTodayRecord
{
    public function __construct(
        public ?string $clockInTime,
        public ?float $totalWorkedHours,
    ) {}
}
