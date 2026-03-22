<?php

declare(strict_types=1);

namespace App\__Generated__\Enums;

/**
 * ユーザーアカウントの状態
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/UserStatus.yaml
 */
enum UserStatus: string
{
        case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}
