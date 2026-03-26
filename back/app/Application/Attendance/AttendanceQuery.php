<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\User;
use Carbon\CarbonImmutable;
use \Illuminate\Support\Collection;

/**
 * 勤怠のクエリ
 */
final class AttendanceQuery
{
    /**
     * 今日の勤怠を取得する
     * 
     * @param User $user ユーザー
     * @return ?Attendance 今日の勤怠
     */
    public function today(User $user): ?Attendance
    {
        $timezone = $user->timezone ?? config('app.timezone');
        $today = CarbonImmutable::today($timezone)->toDateString();

        return Attendance::query()
            ->forUser($user->id)
            ->workDate($today)
            ->latest('clock_in_at')
            ->first();
    }

    /**
     * 勤怠一覧を取得する
     * 
     * @param User $user ユーザー
     * @param string $from 開始日
     * @param string $to 終了日
     * @return array[] 勤怠一覧
     */
    public function list(User $user, string $from, string $to): array
    {
        return Attendance::query()
            ->forUser($user->id)
            ->whereBetween('work_date', [$from, $to])
            ->orderBy('work_date')
            ->orderBy('clock_in_at')
            ->get()
            ->map(fn(Attendance $a) => $a->toLocalTimePayload())
            ->values()
            ->all();
    }

    /**
     * 勤務中の勤怠を取得する。
     *
     * @param User $user ユーザー
     * @return ?Attendance 勤務中の勤怠
     */
    public function findWorkingAttendance(User $user): ?Attendance
    {
        return Attendance::query()
            ->forUser($user->id)
            ->whereNull('clock_out_at')
            ->first();
    }

    // /**
    //  * 最新の勤怠を取得する。
    //  * 
    //  * @param User $user ユーザー
    //  * @return ?Attendance 最新の勤怠
    //  */
    // public function findLatestAttendance(User $user): ?Attendance
    // {
    //     return Attendance::query()
    //         ->forUser($user->id)
    //         ->latest('clock_in_at')
    //         ->first();
    // }

    // /**
    //  * 最近の勤怠休憩を取得する。
    //  * 
    //  * @param string $attendanceId 勤怠ID
    //  * @return ?AttendanceBreak 最近の勤怠休憩
    //  */
    // public function findLatestAttendanceBreak(string $attendanceId): ?AttendanceBreak
    // {
    //     return AttendanceBreak::query()
    //         ->forAttendance($attendanceId)
    //         ->whereNotNull('break_start')
    //         ->whereNull('break_end')
    //         ->latest('break_start')
    //         ->first();
    // }

    // /**
    //  * 休憩が終了済みの勤怠を取得する。
    //  * 
    //  * @param string $attendanceId 勤怠ID
    //  * @return Collection<int, AttendanceBreak> 休憩が終了済みの勤怠
    //  */
    // public function findCompletedBreaks(string $attendanceId): Collection
    // {
    //     return AttendanceBreak::query()
    //         ->where('attendance_id', $attendanceId)
    //         ->whereNotNull('break_start')
    //         ->whereNotNull('break_end')
    //         ->get();
    // }
}
