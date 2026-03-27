<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠のリゾルバ
 */
final class AttendanceResolver
{
    /**
     * 勤怠モデルから現在の打刻状態を判定する。
     */
    public function resolveClockStatus(?Attendance $attendance): ClockStatus
    {
        // 勤務中の勤怠が無い → 退勤状態
        if ($attendance === null || !$attendance->isWorking()) {
            return ClockStatus::OUT;
        }

        // 勤務中 かつ 休憩中がある → 休憩状態
        if (
            $attendance !== null &&
            $attendance->breaks->contains(fn(AttendanceBreak $break) => $break->isBreaking())
        ) {
            return ClockStatus::BREAK;
        }

        // 勤務中 かつ 休憩なし → 出勤状態
        return ClockStatus::IN;
    }
}
