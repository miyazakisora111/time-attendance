<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Data\AttendanceData;
use App\Models\Attendance;
use App\Models\AttendanceBreak;

/**
 * 勤怠データを生成する
 */
class AttendanceDataFactory
{
    /**
     * コンストラクタ
     * 
     * @param AttendanceResolver $attendanceResolver 勤怠リゾルバ
     * @param AttendanceQuery $attendanceQuery 勤怠クエリ
     */
    public function __construct(
        private readonly AttendanceResolver $resolver,
        private readonly AttendanceQuery $query,
    ) {}

    /**
     * 勤怠データを取得する。
     * 
     * @param Attendance $attendance 勤怠
     * @return AttendanceData 勤怠データ
     */
    public function createFromModel(Attendance $attendance): AttendanceData
    {
        // 休憩時間を計算する。
        $completedBreaks = $this->query->findCompletedBreaks($attendance->id);
        $totalBreakMinutes = AttendanceBreak::totalBreakMinutes((array)$completedBreaks);

        // 勤務時間を計算する。
        $workedMinutes = $attendance->workMinutes() - $totalBreakMinutes;

        return new AttendanceData(
            id: $attendance->id,
            userId: $attendance->user_id,
            workDate: $attendance->work_date->toDateString(),
            clockStatus: $this->resolver->resolveClockStatus($attendance)->value,
            breakMinutes: $totalBreakMinutes,
            workedMinutes: $workedMinutes,
        );
    }
}
