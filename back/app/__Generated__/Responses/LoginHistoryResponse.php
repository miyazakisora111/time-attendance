<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

/**
 * LoginHistoryResponse DTO
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class LoginHistoryResponse
{
    public function __construct(
        public string $id,
        public ?string $ipAddress,
        public ?string $userAgent,
        public string $loggedInAt,
        public ?string $loggedOutAt = null,
    ) {}
}
