<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * ダッシュボードサービス
 */
final class DashboardService extends BaseService
{
    /**
     * ダッシュボード情報を取得する。
     *
     * @param User $user 対象ユーザー
     * @return array<string, mixed>
     */
    public function getDashboard(User $user): array
    {
        $todayAttendance = Attendance::query()
            ->user($user->id)
            ->workDate(today()->toDateString())
            ->first();

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'clockStatus' => $this->resolveClockStatus($todayAttendance),
            'todayRecord' => $this->buildTodayRecord($todayAttendance),
            'stats' => $this->buildStats($user),
            'recentRecords' => $this->buildRecentRecords($user),
        ];
    }

    private function buildStats(User $user): array
    {
        $currentMonth = Carbon::today();
        $prevMonth = $currentMonth->copy()->subMonth();

        $currentAttendances = Attendance::query()
            ->user($user->id)
            ->month($currentMonth->year, $currentMonth->month)
            ->orderByDesc('work_date')
            ->get();

        $prevAttendances = Attendance::query()
            ->user($user->id)
            ->month($prevMonth->year, $prevMonth->month)
            ->get();

        $totalHours = $this->sumWorkHours($currentAttendances);
        $workDays = $currentAttendances
            ->filter(fn(Attendance $attendance): bool => $attendance->clock_in_at !== null || $attendance->start_time !== null)
            ->count();
        $targetHours = $workDays * 8;
        $avgHours = $workDays > 0 ? round($totalHours / $workDays, 1) : 0.0;

        $prevTotalHours = $this->sumWorkHours($prevAttendances);
        $prevWorkDays = $prevAttendances->whereNotNull('start_time')->count();
        $prevAvgHours = $prevWorkDays > 0 ? round($prevTotalHours / $prevWorkDays, 1) : 0.0;

        $overtimeHours = 0.0;
        $prevOvertimeHours = 0.0;

        return [
            'totalHours' => $totalHours,
            'targetHours' => $targetHours,
            'workDays' => $workDays,
            'remainingDays' => $this->remainingBusinessDaysInMonth($currentMonth),
            'avgHours' => $avgHours,
            'avgHoursDiff' => round($avgHours - $prevAvgHours, 1),
            'overtimeHours' => $overtimeHours,
            'overtimeDiff' => round($overtimeHours - $prevOvertimeHours, 1),
        ];
    }

    private function buildRecentRecords(User $user): array
    {
        return Attendance::query()
            ->user($user->id)
            ->orderByDesc('work_date')
            ->limit(6)
            ->get()
            ->map(function (Attendance $attendance): array {
                $workHours = $this->calculateWorkHours(
                    startAt: $attendance->clock_in_at,
                    endAt: $attendance->clock_out_at,
                    workedMinutes: $attendance->worked_minutes,
                );

                $date = Carbon::parse($attendance->work_date);

                return [
                    'date' => $date->format('Y/m/d'),
                    'day' => $this->weekdayJa($date),
                    'clockIn' => $attendance->clock_in_at?->setTimezone($this->resolveTimezone($attendance->work_timezone))->format('H:i')
                        ?? (is_string($attendance->start_time) ? substr($attendance->start_time, 0, 5) : null),
                    'clockOut' => $attendance->clock_out_at?->setTimezone($this->resolveTimezone($attendance->work_timezone))->format('H:i')
                        ?? (is_string($attendance->end_time) ? substr($attendance->end_time, 0, 5) : null),
                    'workHours' => $workHours,
                    'status' => $workHours === null
                        ? '休日'
                        : ($workHours > 8.0 ? '残業' : '通常'),
                ];
            })
            ->values()
            ->all();
    }

    private function resolveClockStatus(?Attendance $attendance): string
    {
        if ($attendance === null) {
            return 'out';
        }

        return $attendance->resolveClockStatus();
    }

    private function buildTodayRecord(?Attendance $attendance): array
    {
        if ($attendance === null || ($attendance->clock_in_at === null && $attendance->start_time === null)) {
            return [
                'clockInTime' => null,
                'totalWorkedHours' => null,
            ];
        }

        $hours = $this->calculateWorkHours(
            startAt: $attendance->clock_in_at,
            endAt: $attendance->clock_out_at,
            workedMinutes: $attendance->worked_minutes,
            fallbackEndTime: now(),
        );

        $timezone = $this->resolveTimezone($attendance->work_timezone);

        return [
            'clockInTime' => $attendance->clock_in_at?->setTimezone($timezone)->format('H:i')
                ?? (is_string($attendance->start_time) ? substr($attendance->start_time, 0, 5) : null),
            'totalWorkedHours' => $hours,
        ];
    }

    private function sumWorkHours(Collection $attendances): float
    {
        return round((float) $attendances
            ->map(
                fn(Attendance $attendance): float =>
                $this->calculateWorkHours($attendance->clock_in_at, $attendance->clock_out_at, $attendance->worked_minutes) ?? 0.0
            )
            ->sum(), 1);
    }

    private function remainingBusinessDaysInMonth(Carbon $date): int
    {
        $cursor = $date->copy()->addDay()->startOfDay();
        $end = $date->copy()->endOfMonth();
        $count = 0;

        while ($cursor->lte($end)) {
            if (!$cursor->isWeekend()) {
                $count++;
            }
            $cursor->addDay();
        }

        return $count;
    }
}
