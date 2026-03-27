<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Settings;

/**
 * セキュリティ設定
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class SettingsSecurity
{
    public function __construct(
        public bool $twoFactorEnabled,
        public bool $emailVerified,
        public ?string $lastLoginAt = null,
        public ?string $passwordLastChangedAt = null,
    ) {}
}
