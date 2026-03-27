<?php

declare(strict_types=1);

namespace App\Application\Dashboard;

use App\__Generated__\Enums\AttendanceStatus;
use App\Models\Attendance;
use Carbon\Carbon;

/**
 * ダッシュボードのリゾルバ
 *
 * 勤怠モデルからダッシュボード表示用の値を算出する。
 * AttendanceResolver が「状態判定」に特化するのに対し、
 * こちらは「表示用の集計値・ラベル」の算出を担う。
 */
final class DashboardResolver
{
    /**
     * 今日の勤務時間（時間単位）を算出する
     *
     * @param ?Attendance $attendance 当日の勤怠
     * @return ?float 勤務時間（時間）
     */
    public function resolveTodayWorkedHours(?Attendance $attendance): ?float
    {
        if ($attendance === null || !$attendance->isClockedIn()) {
            return null;
        }

        $minutes = $attendance->workMinutes();

        return round($minutes / 60, 1);
    }

    /**
     * 勤怠レコードの表示用ステータスを解決する
     *
     * @param Attendance $attendance 勤怠
     * @return AttendanceStatus 表示用ステータス
     */
    public function resolveAttendanceStatus(Attendance $attendance): AttendanceStatus
    {
        if ($attendance->isFinished()) {
            return AttendanceStatus::OUT;
        }

        if ($attendance->isWorking()) {
            $hasActiveBreak = $attendance->breaks
                ->contains(fn ($break) => $break->isBreaking());

            return $hasActiveBreak
                ? AttendanceStatus::BREAK
                : AttendanceStatus::WORKING;
        }

        return AttendanceStatus::OUT;
    }

    /**
     * 月次統計を算出する
     *
     * @param \Illuminate\Support\Collection<int, Attendance> $attendances 当月勤怠一覧
     * @return array<string, mixed> 統計情報
     */
    public function resolveMonthlyStats($attendances): array
    {
        $now = Carbon::now();
        $daysInMonth = $now->daysInMonth;

        // 当月の平日数（目標日数）を算出する。
        $targetWorkDays = 0;
        for ($d = 1; $d <= $daysInMonth; $d++) {
            $date = Carbon::create($now->year, $now->month, $d);
            if (!$date->isWeekend()) {
                $targetWorkDays++;
            }
        }

        // 実績を集計する。
        $workedMinutes = $attendances->sum(fn (Attendance $a) => $a->workMinutes());
        $totalHours = round($workedMinutes / 60, 1);
        $targetHours = round($targetWorkDays * 8, 1);
        $workDays = $attendances->filter(fn (Attendance $a) => $a->isClockedIn())->count();

        // 残日数は当日以降の平日数。
        $remainingDays = 0;
        for ($d = $now->day + 1; $d <= $daysInMonth; $d++) {
            $date = Carbon::create($now->year, $now->month, $d);
            if (!$date->isWeekend()) {
                $remainingDays++;
            }
        }

        // 平均勤務時間を算出する。
        $avgHours = $workDays > 0 ? round($totalHours / $workDays, 1) : 0.0;
        $avgHoursDiff = round($avgHours - 8.0, 1);

        // 残業時間を算出する。
        $standardMinutes = $workDays * config('attendance.standard_work_minutes', 480);
        $overtimeMinutes = max(0, $workedMinutes - $standardMinutes);
        $overtimeHours = round($overtimeMinutes / 60, 1);

        return [
            'totalHours' => $totalHours,
            'targetHours' => $targetHours,
            'workDays' => $workDays,
            'remainingDays' => $remainingDays,
            'avgHours' => $avgHours,
            'avgHoursDiff' => $avgHoursDiff,
            'overtimeHours' => $overtimeHours,
            'overtimeDiff' => 0.0,
        ];
    }
}
