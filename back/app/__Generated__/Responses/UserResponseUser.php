<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

/**
 * UserResponseUser DTO
 *
 * @param string[] $roles
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class UserResponseUser
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public array $roles,
        public ?UserResponseUserSettings $settings = null,
    ) {}
}
