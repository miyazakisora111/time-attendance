<?php

declare(strict_types=1);

namespace App\Http\Responses\Factories;

use App\__Generated__\Responses\AttendanceResponse;
use App\Application\Attendance\AttendanceResolver;
use App\Application\Attendance\AttendanceQuery;
use App\Models\Attendance;

/**
 * 勤怠レスポンスを生成する
 */
class AttendanceResponseFactory
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
     * 勤怠レスポンスを作成する。
     * 
     * @param Attendance $attendance 勤怠
     * @return AttendanceResponse 勤怠レスポンス
     */
    public function createFromModel(Attendance $attendance): AttendanceResponse
    {
        // 休憩時間を計算する。
        $totalBreakMinutes = $this->query->getBreaks($attendance->user, $attendance->work_date)
            ->sum(fn($b) => $b->breakMinutes());

        // 勤務時間を計算する。
        $workedMinutes = $attendance->workMinutes() - $totalBreakMinutes;

        return new AttendanceResponse(
            id: $attendance->id,
            userId: $attendance->user_id,
            workDate: $attendance->work_date->toDateString(),
            clockStatus: $this->resolver->resolveClockStatus($attendance),
            clockInAt: $attendance->clock_in_at?->toDateTimeString(),
            clockOutAt: $attendance->clock_out_at?->toDateTimeString(),
            breakMinutes: $totalBreakMinutes,
            workedMinutes: $workedMinutes,
            overtimeMinutes: max(0, $workedMinutes - config('attendance.standard_work_minutes')),
        );
    }
}
