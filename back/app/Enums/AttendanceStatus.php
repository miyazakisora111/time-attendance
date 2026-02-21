<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * 勤務ステータスの列挙型
 */
enum AttendanceStatus: string
{
    /**
     * 勤務中
     */
    case WORKING = 'working';

    /**
     * 勤務完了
     */
    case COMPLETED = 'completed';

    /**
     * 休暇
     */
    case HOLIDAY = 'holiday';

    /**
     * 特別休暇
     */
    case SPECIAL_LEAVE = 'special_leave';

    /**
     * 表示用ラベルを返す
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::WORKING => '勤務中',
            self::COMPLETED => '勤務完了',
            self::HOLIDAY => '休暇',
            self::SPECIAL_LEAVE => '特別休暇',
        };
    }

    /**
     * 勤務中かどうか判定
     *
     * @return bool
     */
    public function isWorking(): bool
    {
        return $this === self::WORKING;
    }

    /**
     * 完了状態かどうか判定
     *
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this === self::COMPLETED;
    }

    /**
     * 休暇状態かどうか判定
     *
     * @return bool
     */
    public function isLeave(): bool
    {
        return $this === self::HOLIDAY || $this === self::SPECIAL_LEAVE;
    }
}
