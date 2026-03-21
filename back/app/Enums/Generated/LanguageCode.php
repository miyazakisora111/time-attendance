<?php

declare(strict_types=1);

namespace App\Enums\Generated;

/**
 * 表示言語コード
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/LanguageCode.yaml
 */
enum LanguageCode: string
{
    case JA = 'ja';
    case EN = 'en';

    /**
     * 表示用ラベルを返す
     */
    public function label(): string
    {
        return match ($this) {
            self::JA => 'ja',
            self::EN => 'en',
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
