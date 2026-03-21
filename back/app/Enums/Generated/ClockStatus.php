<?php

declare(strict_types=1);

namespace App\Enums\Generated;

/**
 * 現在の打刻状態
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/ClockStatus.yaml
 */
enum ClockStatus: string
{
    case OUT = 'out';
    case IN = 'in';
    case BREAK = 'break';

    /**
     * 表示用ラベルを返す
     */
    public function label(): string
    {
        return match ($this) {
            self::OUT => 'out',
            self::IN => 'in',
            self::BREAK => 'break',
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
