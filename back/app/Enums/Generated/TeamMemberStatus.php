<?php

declare(strict_types=1);

namespace App\Enums\Generated;

/**
 * チームメンバーの勤務状態
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/TeamMemberStatus.yaml
 */
enum TeamMemberStatus: string
{
    case WORKING = 'working';
    case BREAK = 'break';
    case OFF = 'off';
    case LEAVE = 'leave';

    /**
     * 表示用ラベルを返す
     */
    public function label(): string
    {
        return match ($this) {
            self::WORKING => 'working',
            self::BREAK => 'break',
            self::OFF => 'off',
            self::LEAVE => 'leave',
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
