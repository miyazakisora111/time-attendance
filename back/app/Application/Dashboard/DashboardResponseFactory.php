<?php

declare(strict_types=1);

namespace App\Application\Dashboard;

use App\__Generated__\Enums\ClockStatus;
use App\__Generated__\Responses\Dashboard\DashboardRecentRecord;
use App\__Generated__\Responses\Dashboard\DashboardResponse;
use App\__Generated__\Responses\Dashboard\DashboardStats;
use App\__Generated__\Responses\Dashboard\DashboardTodayRecord;
use App\__Generated__\Responses\Dashboard\DashboardUser;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;

/**
 * ダッシュボードレスポンスのファクトリ
 */
final class DashboardResponseFactory
{
    public function __construct(
        private readonly DashboardResolver $resolver,
    ) {}

    /**
     * ダッシュボードレスポンスを生成する
     *
     * @param User $user ユーザー
     * @param ClockStatus $clockStatus 打刻状態
     * @param ?Attendance $todayAttendance 当日の勤怠
     * @param array<string, mixed> $stats 月次統計
     * @param \Illuminate\Support\Collection $recentAttendances 直近の勤怠一覧
     * @return DashboardResponse ダッシュボードレスポンス
     */
    public function create(
        User $user,
        ClockStatus $clockStatus,
        ?Attendance $todayAttendance,
        array $stats,
        $recentAttendances,
    ): DashboardResponse {
        return new DashboardResponse(
            user: new DashboardUser(
                id: $user->id,
                name: $user->name,
            ),
            clockStatus: $clockStatus,
            todayRecord: new DashboardTodayRecord(
                clockInTime: $todayAttendance?->clock_in_at?->format('H:i'),
                totalWorkedHours: $this->resolver->resolveTodayWorkedHours($todayAttendance),
            ),
            stats: new DashboardStats(
                totalHours: $stats['totalHours'],
                targetHours: $stats['targetHours'],
                workDays: $stats['workDays'],
                remainingDays: $stats['remainingDays'],
                avgHours: $stats['avgHours'],
                avgHoursDiff: $stats['avgHoursDiff'],
                overtimeHours: $stats['overtimeHours'],
                overtimeDiff: $stats['overtimeDiff'],
            ),
            recentRecords: $recentAttendances
                ->map(fn (Attendance $a) => $this->toRecentRecord($a))
                ->values()
                ->all(),
        );
    }

    /**
     * 勤怠モデルから直近レコード DTO を生成する
     *
     * @param Attendance $attendance 勤怠
     * @return DashboardRecentRecord 直近レコード
     */
    private function toRecentRecord(Attendance $attendance): DashboardRecentRecord
    {
        $workDate = Carbon::parse($attendance->work_date);
        $weekdays = ['日', '月', '火', '水', '木', '金', '土'];

        $workedMinutes = $attendance->workMinutes();
        $workHours = $attendance->isClockedIn() ? round($workedMinutes / 60, 1) : null;

        return new DashboardRecentRecord(
            date: $workDate->format('Y/m/d'),
            day: $weekdays[$workDate->dayOfWeek],
            clockIn: $attendance->clock_in_at?->format('H:i'),
            clockOut: $attendance->clock_out_at?->format('H:i'),
            workHours: $workHours,
            status: $this->resolver->resolveAttendanceStatus($attendance),
        );
    }
}
