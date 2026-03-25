<?php

declare(strict_types=1);

namespace App\Application\Queries;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\User;
use Carbon\CarbonImmutable;

/**
 * 勤怠のクエリ
 */
final class AttendanceQuery
{
    /**
     * 今日の勤怠を取得する
     * 
     * @param User $user ユーザー
     * @return array|array<string, mixed> 今日の勤怠
     */
    public function today(User $user): array
    {
        $timezone = $user->timezone ?? config('app.timezone');
        $today = CarbonImmutable::today($timezone)->toDateString();

        $attendance = Attendance::query()
            ->where('user_id', $user->id)
            ->where('work_date', $today)
            ->latest('clock_in_at')
            ->first();

        return $attendance?->toLocalTimePayload() ?? [
            'userId' => $user->id,
            'workDate' => $today,
            'clockStatus' => 'out',
            'startTime' => null,
        ];
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
            ->where('user_id', $user->id)
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
            ->where('user_id', $user->id)
            ->whereNotNull('clock_in_at')
            ->whereNull('clock_out_at')
            ->latest('clock_in_at')
            ->first();
    }

    /**
     * 休憩中かどうかを判定する。
     * 
     * @param string $attendanceId 勤怠ID
     * @return ?AttendanceBreak 休憩中の勤怠
     */
    public function findBreakingAttendance(string $attendanceId): ?AttendanceBreak
    {
        return AttendanceBreak::query()
            ->where('attendance_id', $attendanceId)
            ->whereNotNull('break_start')
            ->whereNull('break_end')
            ->latest('clock_in_at')
            ->first();
    }
}
