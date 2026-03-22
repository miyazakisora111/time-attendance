<?php

declare(strict_types=1);

namespace App\__Generated__\Enums;

/**
 * 申請のステータス
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/ApprovalStatus.yaml
 */
enum ApprovalStatus: string
{
        case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case CANCELED = 'canceled';
}
