<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\User;

/**
 * ユーザー情報
 *
 * @param string[] $roles
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class UserResponse
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public array $roles,
        public ?Settings $settings = null,
    ) {}
}
