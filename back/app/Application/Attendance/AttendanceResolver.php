<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Models\Attendance;
use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠に関する状態を判定するクラス
 */
class AttendanceResolver
{
    /**
     * コンストラクタ
     * 
     * @param AttendanceQuery $query 勤怠のクエリ
     */
    public function __construct(
        private AttendanceQuery $query,
    ) {}

    /**
     * 勤怠ステータスを判定する
     * 
     * @param Attendance $attendance 勤怠
     * @return ClockStatus 勤怠ステータス
     */
    public function resolveClockStatus(Attendance $attendance): ClockStatus
    {
        // 退勤中
        if (!$attendance->isClockedIn() || $attendance->isClockedOut()) {
            return ClockStatus::OUT;
        }

        // 休憩中
        $latestAttendanceBreak = $this->query->findLatestAttendanceBreak($attendance->id);
        if ($latestAttendanceBreak && !$latestAttendanceBreak->isBreaking()) {
            return ClockStatus::BREAK;
        }

        // 勤務中
        return ClockStatus::IN;
    }
}
