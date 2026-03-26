<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

use App\__Generated__\Enums\AttendanceStatus;

/**
 * 直近の勤怠レコード
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class DashboardRecentRecord
{
    public function __construct(
        public string $date,
        public string $day,
        public ?string $clockIn,
        public ?string $clockOut,
        public ?float $workHours,
        public AttendanceStatus $status,
    ) {}
}
