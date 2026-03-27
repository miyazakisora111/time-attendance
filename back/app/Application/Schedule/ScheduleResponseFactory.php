<?php

declare(strict_types=1);

namespace App\Application\Schedule;

use App\__Generated__\Responses\Calendar\CalendarDay;
use App\__Generated__\Responses\Calendar\CalendarResponse;
use App\__Generated__\Responses\Calendar\CalendarSummary;
use App\Models\Attendance;
use Illuminate\Support\Collection;

/**
 * スケジュールレスポンスのファクトリ
 */
final class ScheduleResponseFactory
{
    /**
     * カレンダーレスポンスを生成する
     *
     * @param int $year 年
     * @param int $month 月
     * @param CalendarSummary $summary 月次サマリー
     * @param array<int, CalendarDay> $days 日次リスト
     * @return CalendarResponse カレンダーレスポンス
     */
    public function createCalendarResponse(
        int $year,
        int $month,
        CalendarSummary $summary,
        array $days,
    ): CalendarResponse {
        return new CalendarResponse(
            year: $year,
            month: $month,
            summary: $summary,
            days: $days,
        );
    }

    /**
     * カレンダーサマリーを生成する
     *
     * @param Collection<int, Attendance> $attendances 勤怠一覧
     * @param int $scheduledWorkDays 所定勤務日数
     * @param float $remainingPaidLeaveDays 有給残日数
     * @return CalendarSummary カレンダーサマリー
     */
    public function createSummary(
        Collection $attendances,
        int $scheduledWorkDays,
        float $remainingPaidLeaveDays,
    ): CalendarSummary {
        $totalWorkHours = round((float) $attendances
            ->sum(fn (Attendance $a): float => $a->workMinutes() / 60), 1);

        return new CalendarSummary(
            totalWorkHours: $totalWorkHours,
            targetHours: round($scheduledWorkDays * 8, 1),
            scheduledWorkDays: $scheduledWorkDays,
            overtimeHours: 0.0,
            paidLeaveDays: 0.0,
            remainingPaidLeaveDays: $remainingPaidLeaveDays,
        );
    }
}
