<?php

declare(strict_types=1);

namespace App\Infrastructure\Schedule\Query;

use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\PaidLeaveGrant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * スケジュールのクエリ
 */
final class ScheduleQuery
{
    /**
     * 指定年月の勤怠一覧を取得する
     *
     * @param User $user ユーザー
     * @param int $year 年
     * @param int $month 月
     * @return Collection<int, Attendance> 勤怠一覧（work_date でキーイング済み）
     */
    public function getMonthlyAttendances(User $user, int $year, int $month): Collection
    {
        return Attendance::query()
            ->forUser($user->id)
            ->month($year, $month)
            ->get()
            ->keyBy(fn(Attendance $a): string => $a->work_date?->toDateString() ?? '');
    }

    /**
     * 指定年月の祝日一覧を取得する
     *
     * @param int $year 年
     * @param int $month 月
     * @return Collection<int, Holiday> 祝日一覧（holiday_date でキーイング済み）
     */
    public function getMonthlyHolidays(int $year, int $month): Collection
    {
        return Holiday::query()
            ->month($year, $month)
            ->get()
            ->keyBy(fn(Holiday $h): string => $h->holiday_date?->toDateString() ?? '');
    }

    /**
     * 有効な有給残日数を取得する
     *
     * @param User $user ユーザー
     * @return float 有給残日数
     */
    public function getRemainingPaidLeaveDays(User $user): float
    {
        return round((float) PaidLeaveGrant::query()
            ->forUser($user->id)
            ->where('expires_at', '>=', now())
            ->sum('days'), 1);
    }
}
