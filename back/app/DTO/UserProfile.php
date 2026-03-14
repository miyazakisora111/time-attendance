<?php

declare(strict_types=1);

namespace App\DTO;

final class UserProfile extends BaseDTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $email,
        public readonly array $roles,
        public readonly ?array $settings,
        public readonly bool $isAuthenticated = true,
    ) {}
}
