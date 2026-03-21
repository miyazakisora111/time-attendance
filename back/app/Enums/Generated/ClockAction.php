<?php

declare(strict_types=1);

namespace App\Enums\Generated;

/**
 * 打刻アクション種別
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/ClockAction.yaml
 */
enum ClockAction: string
{
    case IN = 'in';
    case OUT = 'out';
    case BREAK_START = 'break_start';
    case BREAK_END = 'break_end';

    /**
     * 表示用ラベルを返す
     */
    public function label(): string
    {
        return match ($this) {
            self::IN => 'in',
            self::OUT => 'out',
            self::BREAK_START => 'break_start',
            self::BREAK_END => 'break_end',
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
