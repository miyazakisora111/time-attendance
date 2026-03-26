<?php

declare(strict_types=1);

namespace App\__Generated__\Enums;

/**
 * チームメンバーの勤務状態
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-enums
 * Source: openapi/components/enums/TeamMemberStatus.yaml
 */
enum TeamMemberStatus: string
{
        case WORKING = 'working';
    case BREAK = 'break';
    case OFF = 'off';
    case LEAVE = 'leave';
}
