<?php

declare(strict_types=1);

namespace App\Infrastructure\Calendar\Query;

use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\PaidLeaveGrant;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * カレンダーのクエリ
 */
final class CalendarQuery
{
    /**
     * 指定年月の勤怠一覧を取得する
     *
     * @param User $user ユーザー
     * @param int $year 年
     * @param int $month 月
     * @return Collection<string, Attendance> 勤怠一覧（work_date でキーイング済み）
     */
    public function getMonthlyAttendances(User $user, int $year, int $month): Collection
    {
        return Attendance::query()
            ->user($user->id)
            ->month($year, $month)
            ->get()
            ->keyBy(fn(Attendance $attendance): string => $attendance->work_date?->toDateString() ?? '');
    }

    /**
     * 指定年月の祝日一覧を取得する
     *
     * @param int $year 年
     * @param int $month 月
     * @return Collection<string, Holiday> 祝日一覧（holiday_date でキーイング済み）
     */
    public function getMonthlyHolidays(int $year, int $month): Collection
    {
        return Holiday::query()
            ->month($year, $month)
            ->get()
            ->keyBy(fn(Holiday $holiday): string => $holiday->holiday_date?->toDateString() ?? '');
    }

    /**
     * 有効な有給付与日数を取得する
     *
     * @param User $user ユーザー
     * @return float 有給付与日数
     */
    public function getGrantedPaidLeaveDays(User $user): float
    {
        return round((float) PaidLeaveGrant::query()
            ->user($user->id)
            ->active()
            ->sum('days'), 1);
    }
}
