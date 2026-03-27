<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\User;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use \Illuminate\Support\Collection;

/**
 * 勤怠のクエリ
 */
final class AttendanceQuery
{
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
     * 最新の勤怠を取得する。
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
     * 最新の勤怠を取得する。
     *
     * @param User $user ユーザー
     * @return ?Attendance 最新の勤怠
     */
    public function getLatestAttendanceBreak(User $user): ?Attendance
    {
        return Attendance::query()
            ->forUser($user->id)
            ->with(['breaks' => fn($q) => $q->latest('break_start_at')])
            ->latest('clock_in_at')
            ->first();
    }

    /**
     * 休憩が終了済みの勤怠を取得する。
     * 
     * @param User $user ユーザー
     * @param CarbonInterface $workDate 勤務日
     * @return Collection<int, AttendanceBreak> 休憩が終了済みの勤怠
     */
    public function getBreaks(User $user, CarbonInterface $workDate): Collection
    {
        return AttendanceBreak::query()
            ->leftJoin('attendances', 'attendance_breaks.attendance_id', '=', 'attendances.id')
            ->where('attendances.user_id', $user->id)
            ->whereDate('attendances.work_date', $workDate)
            ->whereNotNull('attendance_breaks.break_start_at')
            ->whereNotNull('attendance_breaks.break_end_at')
            ->select('attendance_breaks.*')
            ->get();
    }
}
