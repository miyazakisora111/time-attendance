<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

use App\__Generated__\Enums\LanguageCode;
use App\__Generated__\Enums\ThemeType;

/**
 * ユーザー設定
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class UserResponseUserSettings
{
    public function __construct(
        public ?ThemeType $theme = null,
        public ?LanguageCode $language = null,
    ) {}
}
