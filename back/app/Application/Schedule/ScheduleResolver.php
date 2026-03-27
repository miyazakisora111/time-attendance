<?php

declare(strict_types=1);

namespace App\Application\Schedule;

use App\__Generated__\Enums\CalendarDayStatus;
use App\Models\Attendance;
use App\Models\Holiday;

/**
 * スケジュールのリゾルバ
 *
 * カレンダー日付の状態・シフト・時間帯などの表示値を算出する。
 */
final class ScheduleResolver
{
    private const DEFAULT_SHIFT = '通常勤務';
    private const DEFAULT_LOCATION = 'Office-A';

    /**
     * 日次ステータスを解決する
     *
     * @param bool $isWeekend 週末かどうか
     * @param ?Holiday $holiday 祝日
     * @return CalendarDayStatus カレンダー日付ステータス
     */
    public function resolveDayStatus(bool $isWeekend, ?Holiday $holiday): CalendarDayStatus
    {
        if ($holiday !== null) {
            return CalendarDayStatus::HOLIDAY;
        }

        if ($isWeekend) {
            return CalendarDayStatus::OFF;
        }

        return CalendarDayStatus::WORKING;
    }

    /**
     * シフトラベルを返す
     *
     * @param CalendarDayStatus $status 日次ステータス
     * @return ?string シフトラベル
     */
    public function resolveShift(CalendarDayStatus $status): ?string
    {
        return match ($status) {
            CalendarDayStatus::WORKING => self::DEFAULT_SHIFT,
            CalendarDayStatus::HOLIDAY => '祝日',
            default => null,
        };
    }

    /**
     * 勤務時間帯を返す
     *
     * @param ?Attendance $attendance 勤怠
     * @param CalendarDayStatus $status 日次ステータス
     * @return ?string 勤務時間帯
     */
    public function resolveTimeRange(?Attendance $attendance, CalendarDayStatus $status): ?string
    {
        if ($status !== CalendarDayStatus::WORKING) {
            return null;
        }

        $clockInAt = $attendance?->clock_in_at?->format('H:i') ?? '09:00';
        $clockOutAt = $attendance?->clock_out_at?->format('H:i') ?? '18:00';

        return sprintf('%s - %s', $clockInAt, $clockOutAt);
    }

    /**
     * 勤務場所を返す
     *
     * @param CalendarDayStatus $status 日次ステータス
     * @return ?string 勤務場所
     */
    public function resolveLocation(CalendarDayStatus $status): ?string
    {
        return $status === CalendarDayStatus::WORKING ? self::DEFAULT_LOCATION : null;
    }
}
