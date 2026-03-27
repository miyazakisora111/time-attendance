<?php

declare(strict_types=1);

namespace App\Application\Schedule;

use App\Application\BaseService;
use App\__Generated__\Enums\CalendarDayStatus;
use App\__Generated__\Responses\Calendar\CalendarDay;
use App\__Generated__\Responses\Calendar\CalendarResponse;
use App\Models\User;
use Carbon\Carbon;

/**
 * スケジュールのサービス
 */
final class ScheduleService extends BaseService
{
    /**
     * コンストラクタ
     *
     * @param ScheduleQuery $query スケジュールのクエリ
     * @param ScheduleResolver $resolver スケジュールのリゾルバ
     * @param ScheduleResponseFactory $factory スケジュールレスポンスファクトリ
     */
    public function __construct(
        private readonly ScheduleQuery $query,
        private readonly ScheduleResolver $resolver,
        private readonly ScheduleResponseFactory $factory,
    ) {}

    /**
     * 指定された年月のカレンダー情報を取得する
     *
     * @param User $user 対象ユーザー
     * @param int $year 対象年
     * @param int $month 対象月
     * @return CalendarResponse カレンダーレスポンス
     */
    public function getCalendar(User $user, int $year, int $month): CalendarResponse
    {
        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();
        $today = today()->toDateString();

        // 当月の勤怠・祝日を取得する。
        $attendances = $this->query->getMonthlyAttendances($user, $year, $month);
        $holidays = $this->query->getMonthlyHolidays($year, $month);

        // 日次リストを構築する。
        $days = [];
        $scheduledWorkDays = 0;

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $isoDate = $date->toDateString();
            $attendance = $attendances->get($isoDate);
            $holiday = $holidays->get($isoDate);

            $status = $this->resolver->resolveDayStatus(
                isWeekend: $date->isWeekend(),
                holiday: $holiday,
            );

            if ($status === CalendarDayStatus::WORKING) {
                $scheduledWorkDays++;
            }

            $days[] = new CalendarDay(
                date: $isoDate,
                label: sprintf('%d/%d', $date->month, $date->day),
                dayOfWeek: $this->weekdayJa($date),
                status: $status,
                isToday: $isoDate === $today,
                isHoliday: $status !== CalendarDayStatus::WORKING,
                shift: $this->resolver->resolveShift($status),
                timeRange: $this->resolver->resolveTimeRange($attendance, $status),
                location: $this->resolver->resolveLocation($status),
                note: $holiday?->name,
            );
        }

        // 月次サマリーを構築する。
        $remainingPaidLeaveDays = $this->query->getRemainingPaidLeaveDays($user);
        $summary = $this->factory->createSummary($attendances, $scheduledWorkDays, $remainingPaidLeaveDays);

        return $this->factory->createCalendarResponse($year, $month, $summary, $days);
    }
}
