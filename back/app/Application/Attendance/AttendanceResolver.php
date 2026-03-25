<?php

namespace App\Resolvers;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Application\Attendance\
use App\__Generated__\Enums\ClockStatus;

class AttendanceResolver
{
    public function __construct(
        private AttendanceQuery $query,
    ) {
    }

    /**
     * 勤怠ステータスを判定する
     */
    public function resolveClockStatus(Attendance $attendance): ClockStatus
    {
        // 退勤中
        if (! $attendance->isClockedIn() || $attendance->isClockedOut()) {
            return ClockStatus::OUT;
        }

        // 休憩中
        $hasActiveBreak = $this->query->hasActiveBreak($attendance->id);
        if ($hasActiveBreak) {
            return ClockStatus::BREAK;
        }

        // 勤務中
        return ClockStatus::IN;
    }
}
