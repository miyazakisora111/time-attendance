<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\PaidLeaveGrant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * カレンダーのサービスクラス
 */
final class CalendarService extends BaseService
{
    private const DEFAULT_SHIFT = '通常勤務';
    private const DEFAULT_LOCATION = 'Office-A';

    /**
     * 指定された年月のカレンダー情報を取得する。
     *
     * @param User $user 対象ユーザー
     * @param int $year 対象年
     * @param int $month 対象月
     *
     * @return array<string, mixed>
     */
    public function getCalendar(User $user, int $year, int $month): array
    {
        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();
        $today = today()->toDateString();

        $attendances = Attendance::query()
            ->user($user->id)
            ->month($year, $month)
            ->get()
            ->keyBy(fn(Attendance $attendance): string => $attendance->work_date?->toDateString() ?? '');

        $holidays = Holiday::query()
            ->month($year, $month)
            ->get()
            ->keyBy(fn(Holiday $holiday): string => $holiday->holiday_date?->toDateString() ?? '');

        $days = [];
        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $isoDate = $date->toDateString();
            $attendance = $attendances->get($isoDate);
            $holiday = $holidays->get($isoDate);
            $isWeekend = $date->isWeekend();

            $status = $this->resolveDayStatus(
                isWeekend: $isWeekend,
                holiday: $holiday,
            );

            $days[] = [
                'date' => $isoDate,
                'label' => sprintf('%d/%d', $date->month, $date->day),
                'dayOfWeek' => $this->weekdayJa($date),
                'status' => $status,
                'shift' => $this->resolveShift($status),
                'timeRange' => $this->resolveTimeRange($attendance, $status),
                'location' => $status === 'working' ? self::DEFAULT_LOCATION : null,
                'note' => $holiday?->name,
                'isToday' => $isoDate === $today,
                'isHoliday' => $status !== 'working',
            ];
        }

        return [
            'year' => $year,
            'month' => $month,
            'summary' => $this->buildSummary($user, $year, $month, collect($days), $attendances),
            'days' => $days,
        ];
    }

    /**
     * 日次ステータスを解決する。
     */
    private function resolveDayStatus(bool $isWeekend, ?Holiday $holiday): string
    {
        if ($holiday !== null) {
            return 'holiday';
        }

        if ($isWeekend) {
            return 'off';
        }

        return 'working';
    }

    /**
     * シフトラベルを返す。
     */
    private function resolveShift(string $status): ?string
    {
        return match ($status) {
            'working' => self::DEFAULT_SHIFT,

            'holiday' => '祝日',
            default => null,
        };
    }

    /**
     * 勤務時間帯を返す。
     */
    private function resolveTimeRange(?Attendance $attendance, string $status): ?string
    {
        if ($status !== 'working') {
            return null;
        }

        $startTime = $attendance?->clock_in_at?->format('H:i')
            ?? (is_string($attendance?->start_time) ? substr((string) $attendance->start_time, 0, 5) : null)
            ?? '09:00';

        $endTime = $attendance?->clock_out_at?->format('H:i')
            ?? (is_string($attendance?->end_time) ? substr((string) $attendance->end_time, 0, 5) : null)
            ?? '18:00';

        return sprintf('%s - %s', $startTime, $endTime);
    }

    /**
     * 月次サマリーを構築する。
     */
    private function buildSummary(
        User $user,
        int $year,
        int $month,
        Collection $days,
        Collection $attendances,
    ): array {
        $scheduledWorkDays = $days->filter(fn(array $day): bool => $day['status'] === 'working')->count();
        $totalWorkHours = round((float) $attendances
            ->map(fn(Attendance $attendance): float => ($attendance->calculateWorkedMinutes() ?? ($attendance->worked_minutes ?? 0)) / 60)
            ->sum(), 1);

        $overtimeHours = 0.0;

        $paidLeaveDays = 0.0;
        $grantedDays = round((float) PaidLeaveGrant::query()
            ->user($user->id)
            ->active()
            ->sum('days'), 1);
        $usedDays = 0.0;

        return [
            'totalWorkHours' => $totalWorkHours,
            'targetHours' => round($scheduledWorkDays * 8, 1),
            'scheduledWorkDays' => $scheduledWorkDays,
            'overtimeHours' => $overtimeHours,
            'paidLeaveDays' => $paidLeaveDays,
            'remainingPaidLeaveDays' => max(round($grantedDays - $usedDays, 1), 0),
        ];
    }
}
