<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

use App\__Generated__\Enums\TeamMemberStatus;

/**
 * チームメンバー情報
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class TeamMember
{
    public function __construct(
        public string $id,
        public string $name,
        public string $role,
        public string $department,
        public TeamMemberStatus $status,
        public string $email,
        public ?string $clockInTime = null,
    ) {}
}
