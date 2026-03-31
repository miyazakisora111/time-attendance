<?php

declare(strict_types=1);

namespace App\Http\Responses\Factories;

use App\__Generated__\Enums\ClockStatus;
use App\__Generated__\Responses\Attendance\AttendanceResponse;

/**
 * 勤怠レスポンスを生成する（整形のみ）
 */
class AttendanceResponseFactory
{
    /**
     * ReadModel（SQL結果）から勤怠レスポンスを作成する。
     *
     * @param ?object $readModel SQL結果
     * @param ClockStatus $clockStatus 打刻状態
     * @return AttendanceResponse 勤怠レスポンス
     */
    public function create(?object $readModel, ClockStatus $clockStatus): AttendanceResponse
    {
        if ($readModel === null) {
            return new AttendanceResponse(
                userId: null,
                workDate: null,
                clockStatus: $clockStatus,
                clockInAt: null,
                clockOutAt: null,
                breakMinutes: 0,
                workedMinutes: 0,
                overtimeMinutes: 0,
            );
        }

        $workedMinutes = (int) $readModel->worked_minutes;

        return new AttendanceResponse(
            userId: $readModel->user_id,
            workDate: $readModel->work_date,
            clockStatus: $clockStatus,
            clockInAt: $readModel->clock_in_at,
            clockOutAt: $readModel->clock_out_at,
            breakMinutes: (int) $readModel->break_minutes,
            workedMinutes: $workedMinutes,
            overtimeMinutes: max(
                0,
                $workedMinutes - (int) config('attendance.standard_work_minutes')
            ),
        );
    }
}
