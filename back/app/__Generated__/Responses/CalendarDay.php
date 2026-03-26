<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

use App\__Generated__\Enums\CalendarDayStatus;

/**
 * カレンダー1日分の情報
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class CalendarDay
{
    public function __construct(
        public string $date,
        public string $label,
        public string $dayOfWeek,
        public CalendarDayStatus $status,
        public bool $isToday,
        public bool $isHoliday,
        public ?string $shift = null,
        public ?string $timeRange = null,
        public ?string $location = null,
        public ?string $note = null,
    ) {}
}
