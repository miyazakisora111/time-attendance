<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\OvertimeRequest;
use App\Models\PaidLeaveGrant;
use App\Models\PaidLeaveRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * カレンダーのサービスクラス
 */
class CalendarService extends BaseService
{
    private const DEFAULT_SHIFT = '通常勤務';
    private const DEFAULT_TIME_RANGE = '09:00 - 18:00';
    private const DEFAULT_LOCATION = 'Office-A';

    /**
     * 指定された年月のカレンダー情報を取得する。
     * 
     * @param int $year 対象年
     * @param int $month 対象月
     *
     * @return array<string, mixed>
     */
    public function getCalendar(int $year, int $month): array
    {
        $user = $this->resolveUser();
        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();
        $today = today()->toDateString();

        $attendances = Attendance::query()
            ->user($user->id)
            ->month($year, $month)
            ->get()
            ->keyBy(fn (Attendance $attendance): string => $attendance->work_date?->toDateString() ?? '');

        $holidays = Holiday::query()
            ->month($year, $month)
            ->get()
            ->keyBy(fn (Holiday $holiday): string => $holiday->holiday_date?->toDateString() ?? '');

        $paidLeaves = PaidLeaveRequest::query()
            ->user($user->id)
            ->approved()
            ->whereYear('leave_date', $year)
            ->whereMonth('leave_date', $month)
            ->get()
            ->keyBy(fn (PaidLeaveRequest $request): string => $request->leave_date?->toDateString() ?? '');

        $days = [];
        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $isoDate = $date->toDateString();
            $attendance = $attendances->get($isoDate);
            $holiday = $holidays->get($isoDate);
            $paidLeave = $paidLeaves->get($isoDate);
            $isWeekend = $date->isWeekend();

            $status = $this->resolveDayStatus(
                isWeekend: $isWeekend,
                holiday: $holiday,
                paidLeave: $paidLeave,
            );

            $days[] = [
                'date' => $isoDate,
                'label' => sprintf('%d/%d', $date->month, $date->day),
                'dayOfWeek' => $this->weekdayJa($date),
                'status' => $status,
                'shift' => $this->resolveShift($status),
                'timeRange' => $this->resolveTimeRange($attendance, $status),
                'location' => $status === 'working' ? self::DEFAULT_LOCATION : null,
                'note' => $holiday?->name ?? $paidLeave?->reason,
                'isToday' => $isoDate === $today,
                'isHoliday' => $status !== 'working',
            ];
        }

        return [
            'year' => $year,
            'month' => $month,
            'summary' => $this->buildSummary($user, $year, $month, collect($days), $attendances, $paidLeaves),
            'days' => $days,
        ];
    }

    /**
     * 認証ユーザーを解決する。
     */
    private function resolveUser(): User
    {
        /** @var User|null $authUser */
        $authUser = auth()->user();
        if ($authUser instanceof User) {
            return $authUser;
        }

        /** @var User $fallback */
        $fallback = User::query()->active()->ordered()->firstOrFail();

        return $fallback;
    }

    /**
     * 日次ステータスを解決する。
     */
    private function resolveDayStatus(bool $isWeekend, ?Holiday $holiday, ?PaidLeaveRequest $paidLeave): string
    {
        if ($paidLeave !== null) {
            return 'pending';
        }

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
            'pending' => '有給休暇',
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
        Collection $paidLeaves,
    ): array {
        $scheduledWorkDays = $days->filter(fn (array $day): bool => $day['status'] === 'working')->count();
        $totalWorkHours = round((float) $attendances
            ->map(fn (Attendance $attendance): float => ($attendance->calculateWorkedMinutes() ?? ($attendance->worked_minutes ?? 0)) / 60)
            ->sum(), 1);

        $overtimeHours = round((float) OvertimeRequest::query()
            ->user($user->id)
            ->approved()
            ->whereYear('work_date', $year)
            ->whereMonth('work_date', $month)
            ->get()
            ->sum(fn (OvertimeRequest $request): float => $request->getDurationHours()), 1);

        $paidLeaveDays = round((float) $paidLeaves->sum('days'), 1);
        $grantedDays = round((float) PaidLeaveGrant::query()
            ->user($user->id)
            ->active()
            ->sum('days'), 1);
        $usedDays = round((float) PaidLeaveRequest::query()
            ->user($user->id)
            ->approved()
            ->sum('days'), 1);

        return [
            'totalWorkHours' => $totalWorkHours,
            'targetHours' => round($scheduledWorkDays * 8, 1),
            'scheduledWorkDays' => $scheduledWorkDays,
            'overtimeHours' => $overtimeHours,
            'paidLeaveDays' => $paidLeaveDays,
            'remainingPaidLeaveDays' => max(round($grantedDays - $usedDays, 1), 0),
        ];
    }

    /**
     * 日本語曜日を返す。
     */
    private function weekdayJa(Carbon $date): string
    {
        return ['日', '月', '火', '水', '木', '金', '土'][$date->dayOfWeek];
    }
}
