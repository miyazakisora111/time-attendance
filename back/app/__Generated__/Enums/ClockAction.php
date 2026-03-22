<?php

declare(strict_types=1);

namespace App\__Generated__\Enums;

/**
 * 打刻アクション種別
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/ClockAction.yaml
 */
enum ClockAction: string
{
        case IN = 'in';
    case OUT = 'out';
    case BREAK_START = 'break_start';
    case BREAK_END = 'break_end';
}
