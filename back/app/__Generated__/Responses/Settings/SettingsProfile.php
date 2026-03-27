<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Settings;

/**
 * ユーザープロフィール情報（HTTPレスポンス用）
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class SettingsProfile
{
    public function __construct(
        public string $name,
        public string $email,
        public string $department,
        public string $role,
        public string $employeeCode,
    ) {}
}
