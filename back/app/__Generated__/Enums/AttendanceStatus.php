<?php

declare(strict_types=1);

namespace App\__Generated__\Enums;

/**
 * 勤怠レコードの勤務区分
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/AttendanceStatus.yaml
 */
enum AttendanceStatus: string
{
        case WORKING = 'working';
    case OUT = 'out';
    case BREAK = 'break';
}
