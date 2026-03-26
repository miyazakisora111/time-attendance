<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

/**
 * カレンダー月次サマリー
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class CalendarSummary
{
    public function __construct(
        public float $totalWorkHours,
        public float $targetHours,
        public int $scheduledWorkDays,
        public float $overtimeHours,
        public float $paidLeaveDays,
        public float $remainingPaidLeaveDays,
    ) {}
}
