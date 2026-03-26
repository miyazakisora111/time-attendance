<?php

declare(strict_types=1);

namespace App\__Generated__\Enums;

/**
 * 現在の打刻状態
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-enums
 * Source: openapi/components/enums/ClockStatus.yaml
 */
enum ClockStatus: string
{
        case OUT = 'out';
    case IN = 'in';
    case BREAK = 'break';
}
