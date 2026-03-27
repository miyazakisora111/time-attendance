<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Dashboard;

/**
 * ダッシュボード月次統計
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class DashboardStats
{
    public function __construct(
        public float $totalHours,
        public float $targetHours,
        public int $workDays,
        public int $remainingDays,
        public float $avgHours,
        public float $avgHoursDiff,
        public float $overtimeHours,
        public float $overtimeDiff,
    ) {}
}
