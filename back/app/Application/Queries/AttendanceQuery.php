<?php

declare(strict_types=1);

namespace App\Application\Queries;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\User;
use Carbon\CarbonImmutable;
use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠のクエリ
 */
final class AttendanceQuery
{
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

    public function findOpenAttendance(User $user): ?Attendance
    {
        return Attendance::query()
            ->where('user_id', $user->id)
            ->whereNotNull('clock_in_at')
            ->whereNull('clock_out_at')
            ->latest('clock_in_at')
            ->lockForUpdate()
            ->first();
    }

    public function resolveClockStatus(Attendance $attendance): ClockStatus
    {
        if (! $attendance->isClockedIn() || $attendance->isClockedOut()) {
            return ClockStatus::OUT;
        }

        $hasActiveBreak = AttendanceBreak::query()
            ->where('attendance_id', $attendance->id)
            ->whereNotNull('break_start')
            ->whereNull('break_end')
            ->exists();

        return $hasActiveBreak
            ? ClockStatus::BREAK
            : ClockStatus::IN;
    }
}
