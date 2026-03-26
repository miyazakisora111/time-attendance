<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

/**
 * ユーザープロフィール更新（HTTPリクエスト用）
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class UpdateSettingsProfile
{
    public function __construct(
        public string $name,
        public string $email,
    ) {}
}
