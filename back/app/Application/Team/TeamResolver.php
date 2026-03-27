<?php

declare(strict_types=1);

namespace App\Application\Team;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\__Generated__\Enums\TeamMemberStatus;

/**
 * チームメンバーの状態リゾルバ
 */
final class TeamResolver
{
    /**
     * 勤怠から勤務状態を判定する。
     *
     * @param ?Attendance $attendance 本日の勤怠
     * @return TeamMemberStatus 勤務状態
     */
    public function resolveStatus(?Attendance $attendance): TeamMemberStatus
    {
        // 勤怠なし or 退勤済み → off
        if ($attendance === null || !$attendance->isWorking()) {
            return TeamMemberStatus::OFF;
        }

        // 休憩中の判定
        if (
            $attendance->breaks->contains(
                fn(AttendanceBreak $break) => $break->isBreaking()
            )
        ) {
            return TeamMemberStatus::BREAK;
        }

        // 勤務中
        return TeamMemberStatus::WORKING;
    }
}
