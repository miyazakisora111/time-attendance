<?php

declare(strict_types=1);

namespace App\Enums\Generated;

/**
 * UIテーマ設定
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/ThemeType.yaml
 */
enum ThemeType: string
{
    case LIGHT = 'light';
    case DARK = 'dark';

    /**
     * 表示用ラベルを返す
     */
    public function label(): string
    {
        return match ($this) {
            self::LIGHT => 'light',
            self::DARK => 'dark',
        };
    }

    /**
     * 全ケースの値配列を返す
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(
            static fn (self $case): string => $case->value,
            self::cases(),
        );
    }
}
