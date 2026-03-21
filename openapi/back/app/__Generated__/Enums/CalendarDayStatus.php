<?php

declare(strict_types=1);

namespace App\__Generated__\Enums;

/**
 * カレンダー日付の勤務状態
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/CalendarDayStatus.yaml
 */
enum CalendarDayStatus: string
{
        case WORKING = 'working';
    case OFF = 'off';
    case HOLIDAY = 'holiday';
    case PENDING = 'pending';
}
