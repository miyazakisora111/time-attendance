<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Dashboard;

use App\__Generated__\Enums\ClockStatus;
use App\__Generated__\Responses\Dashboard\DashboardRecentRecord;
use App\__Generated__\Responses\Dashboard\DashboardStats;
use App\__Generated__\Responses\Dashboard\DashboardTodayRecord;
use App\__Generated__\Responses\Dashboard\DashboardUser;

/**
 * DashboardResponse DTO
 *
 * @param DashboardRecentRecord[] $recentRecords
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class DashboardResponse
{
    public function __construct(
        public DashboardUser $user,
        public ClockStatus $clockStatus,
        public DashboardTodayRecord $todayRecord,
        public DashboardStats $stats,
        public array $recentRecords,
    ) {}
}
