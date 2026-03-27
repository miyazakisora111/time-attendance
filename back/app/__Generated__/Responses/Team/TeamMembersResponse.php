<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Team;

use App\__Generated__\Responses\Team\TeamMember;

/**
 * TeamMembersResponse DTO
 *
 * @param TeamMember[] $members
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class TeamMembersResponse
{
    public function __construct(
        public array $members,
    ) {}
}
