<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\DomainException;
use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\OvertimeRequest;
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
            'pendingOvertimeRequests' => OvertimeRequest::query()
                ->user($user->id)
                ->pending()
                ->count(),
        ];
    }

    /**
     * 打刻アクションを実行する。
     *
     * @param User $user 対象ユーザー
     * @param string $action 打刻アクション（in/out/break_start/break_end）
     * @return array<string, mixed>
     *
     * @throws DomainException
     */
    public function clock(User $user, string $action): array
    {
        return $this->transaction(function () use ($user, $action): array {
            $attendance = Attendance::query()
                ->firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'work_date' => today()->toDateString(),
                    ]
                );

            if ($action === 'in') {
                if ($attendance->clock_in_at !== null || $attendance->start_time !== null) {
                    throw new DomainException('既に出勤済みです', 409);
                }

                $attendance->update([
                    'clock_in_at' => now(),
                    'start_time' => now()->format('H:i:s'),
                ]);
            } elseif ($action === 'out') {
                if ($attendance->clock_in_at === null && $attendance->start_time === null) {
                    throw new DomainException('出勤していません', 409);
                }

                if ($attendance->clock_out_at !== null || $attendance->end_time !== null) {
                    throw new DomainException('既に退勤済みです', 409);
                }

                $workedMinutes = $attendance->clock_in_at !== null
                    ? $attendance->clock_in_at->diffInMinutes(now())
                    : null;

                $attendance->update([
                    'clock_out_at' => now(),
                    'worked_minutes' => $workedMinutes,
                    'end_time' => now()->format('H:i:s'),
                ]);
            } elseif ($action === 'break_start') {
                if ($attendance->start_time === null || $attendance->end_time !== null) {
                    throw new DomainException('勤務中のみ休憩を開始できます', 409);
                }

                $activeBreak = AttendanceBreak::query()
                    ->where('attendance_id', $attendance->id)
                    ->whereNull('break_end')
                    ->first();

                if ($activeBreak !== null) {
                    throw new DomainException('既に休憩中です', 409);
                }

                AttendanceBreak::query()->create([
                    'attendance_id' => $attendance->id,
                    'break_start' => now()->format('H:i:s'),
                ]);
            } elseif ($action === 'break_end') {
                $activeBreak = AttendanceBreak::query()
                    ->where('attendance_id', $attendance->id)
                    ->whereNull('break_end')
                    ->latest('break_start')
                    ->first();

                if ($activeBreak === null) {
                    throw new DomainException('進行中の休憩がありません', 409);
                }

                $activeBreak->update([
                    'break_end' => now()->format('H:i:s'),
                ]);
            } else {
                throw new DomainException('不正なアクションです', 422);
            }

            return [
                'action' => $action,
                'timestamp' => now()->toIso8601String(),
                'dashboard' => $this->getDashboard($user),
            ];
        });
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

        $overtimeHours = $this->sumOvertimeHours($user, $currentMonth->year, $currentMonth->month);
        $prevOvertimeHours = $this->sumOvertimeHours($user, $prevMonth->year, $prevMonth->month);

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
                    'clockIn' => $attendance->clock_in_at?->setTimezone($attendance->work_timezone ?? config('app.timezone', 'Asia/Tokyo'))->format('H:i')
                        ?? (is_string($attendance->start_time) ? substr($attendance->start_time, 0, 5) : null),
                    'clockOut' => $attendance->clock_out_at?->setTimezone($attendance->work_timezone ?? config('app.timezone', 'Asia/Tokyo'))->format('H:i')
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
        if ($attendance === null || ($attendance->clock_in_at === null && $attendance->start_time === null)) {
            return 'out';
        }

        if ($attendance->clock_out_at !== null || $attendance->end_time !== null) {
            return 'out';
        }

        $activeBreak = AttendanceBreak::query()
            ->where('attendance_id', $attendance->id)
            ->whereNull('break_end')
            ->exists();

        if ($activeBreak) {
            return 'break';
        }

        return 'in';
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

        $timezone = $attendance->work_timezone ?? config('app.timezone', 'Asia/Tokyo');

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

    private function sumOvertimeHours(User $user, int $year, int $month): float
    {
        $overtimes = OvertimeRequest::query()
            ->user($user->id)
            ->approved()
            ->whereYear('work_date', $year)
            ->whereMonth('work_date', $month)
            ->get();

        return round((float) $overtimes->sum(fn(OvertimeRequest $overtime): float => $overtime->getDurationHours()), 1);
    }

    private function calculateWorkHours(
        mixed $startAt,
        mixed $endAt,
        ?int $workedMinutes = null,
        ?Carbon $fallbackEndTime = null,
    ): ?float {
        if ($workedMinutes !== null) {
            return round($workedMinutes / 60, 1);
        }

        if ($startAt === null) {
            return null;
        }

        $start = Carbon::parse((string) $startAt);
        $end = $endAt !== null
            ? Carbon::parse((string) $endAt)
            : $fallbackEndTime;

        if ($end === null || $end->lt($start)) {
            return null;
        }

        return round($end->diffInMinutes($start) / 60, 1);
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

    private function weekdayJa(Carbon $date): string
    {
        $days = ['日', '月', '火', '水', '木', '金', '土'];

        return $days[$date->dayOfWeek];
    }
}
