<?php

declare(strict_types=1);

namespace App\__Generated__\Enums;

/**
 * 残業申請のステータス
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/OvertimeRequestStatus.yaml
 */
enum OvertimeRequestStatus: string
{
        case PENDING = 'pending';
    case APPROVED = 'approved';
    case RETURNED = 'returned';
    case CANCELED = 'canceled';
}
