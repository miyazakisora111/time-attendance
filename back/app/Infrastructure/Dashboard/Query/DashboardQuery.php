<?php

declare(strict_types=1);

namespace App\Infrastructure\Dashboard\Query;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * ダッシュボードのクエリ
 */
final class DashboardQuery
{
    /**
     * 当日の勤怠を取得する
     *
     * @param User $user ユーザー
     * @return ?Attendance 当日の勤怠
     */
    public function getTodayAttendance(User $user): ?Attendance
    {
        return Attendance::query()
            ->forUser($user->id)
            ->where('work_date', today()->toDateString())
            ->latest('clock_in_at')
            ->first();
    }

    /**
     * 最新の勤怠を取得する（打刻状態の判定用）
     *
     * @param User $user ユーザー
     * @return ?Attendance 最新の勤怠
     */
    public function getLatestAttendance(User $user): ?Attendance
    {
        return Attendance::query()
            ->forUser($user->id)
            ->latest('clock_in_at')
            ->first();
    }

    /**
     * 直近の勤怠一覧を取得する
     *
     * @param User $user ユーザー
     * @param int $limit 取得件数
     * @return Collection<int, Attendance> 直近の勤怠一覧
     */
    public function getRecentAttendances(User $user, int $limit = 5): Collection
    {
        return Attendance::query()
            ->forUser($user->id)
            ->with('breaks')
            ->latest('work_date')
            ->limit($limit)
            ->get();
    }

    /**
     * 当月の勤怠一覧を取得する（統計用）
     *
     * @param User $user ユーザー
     * @return Collection<int, Attendance> 当月の勤怠一覧
     */
    public function getMonthlyAttendances(User $user): Collection
    {
        $now = Carbon::now();

        return Attendance::query()
            ->forUser($user->id)
            ->month($now->year, $now->month)
            ->with('breaks')
            ->get();
    }
}
