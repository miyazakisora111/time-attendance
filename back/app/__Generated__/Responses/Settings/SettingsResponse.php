<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Settings;

use App\__Generated__\Enums\LanguageCode;
use App\__Generated__\Enums\ThemeType;
use App\__Generated__\Responses\Settings\SettingsNotifications;
use App\__Generated__\Responses\Settings\SettingsProfile;
use App\__Generated__\Responses\Settings\SettingsSecurity;

/**
 * SettingsResponse DTO
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class SettingsResponse
{
    public function __construct(
        public SettingsProfile $profile,
        public SettingsNotifications $notifications,
        public SettingsSecurity $security,
        public ThemeType $theme,
        public LanguageCode $language,
    ) {}
}
