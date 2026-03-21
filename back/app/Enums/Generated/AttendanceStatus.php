<?php

declare(strict_types=1);

namespace App\Enums\Generated;

/**
 * 勤怠レコードの勤務区分
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/AttendanceStatus.yaml
 */
enum AttendanceStatus: string
{
    case WORKING = 'working';
    case OUT = 'out';
    case BREAK = 'break';

    /**
     * 表示用ラベルを返す
     */
    public function label(): string
    {
        return match ($this) {
            self::WORKING => 'working',
            self::OUT => 'out',
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
