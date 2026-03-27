<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Calendar;

use App\__Generated__\Responses\Calendar\CalendarDay;
use App\__Generated__\Responses\Calendar\CalendarSummary;

/**
 * CalendarResponse DTO
 *
 * @param CalendarDay[] $days
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class CalendarResponse
{
    public function __construct(
        public int $year,
        public int $month,
        public CalendarSummary $summary,
        public array $days,
    ) {}
}
