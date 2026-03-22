<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\DomainException;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use App\Models\AttendanceBreak;
use Carbon\CarbonImmutable;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * 勤怠サービス
 */
final class AttendanceService extends BaseService
{
    public function clockIn(User $user): array
    {
        return $this->transaction(function () use ($user): array {
            $timezone = $this->resolveTimezone($user->timezone ?? null);
            $now = CarbonImmutable::now($timezone);

            $openAttendance = Attendance::query()
                ->where('user_id', $user->id)
                ->whereNotNull('clock_in_at')
                ->whereNull('clock_out_at')
                ->latest('clock_in_at')
                ->lockForUpdate()
                ->first();

            if ($openAttendance !== null) {
                throw new DomainException('未退勤の勤務が存在します', 'OPEN_ATTENDANCE_EXISTS');
            }

            $attendance = Attendance::query()->create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'work_date' => $now->toDateString(),
                'clock_in_at' => $now,
                'work_timezone' => $timezone,
                // 旧カラム互換。将来的には削除する。
                'start_time' => $now->format('H:i:s'),
            ]);

            return $attendance->toLocalTimePayload();
        });
    }

    public function clockOut(User $user): array
    {
        return $this->transaction(function () use ($user): array {
            $attendance = Attendance::query()
                ->where('user_id', $user->id)
                ->whereNotNull('clock_in_at')
                ->whereNull('clock_out_at')
                ->latest('clock_in_at')
                ->first();

            if ($attendance === null) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }

            $timezone = $this->resolveTimezone($attendance->work_timezone);
            $now = CarbonImmutable::now($timezone);

            if ($attendance->clock_in_at !== null && $now->lte($attendance->clock_in_at->setTimezone($timezone))) {
                throw new DomainException('退勤時刻は出勤時刻より後である必要があります', 'INVALID_CLOCK_OUT_TIME');
            }

            $workedMinutes = $attendance->clock_in_at?->diffInMinutes($now);
            $workedMinutes = $workedMinutes !== null
                ? max(0, $workedMinutes - (int) $attendance->break_minutes)
                : null;

            $attendance->update([
                'clock_out_at' => $now,
                'worked_minutes' => $workedMinutes,
                // 旧カラム互換。将来的には削除する。
                'end_time' => $now->format('H:i:s'),
            ]);

            return $attendance->toLocalTimePayload();
        });
    }

    public function getToday(User $user): array
    {
        $timezone = $this->resolveTimezone($user->timezone ?? null);
        $today = CarbonImmutable::today($timezone)->toDateString();

        $attendance = Attendance::query()
            ->where('user_id', $user->id)
            ->where('work_date', $today)
            ->latest('clock_in_at')
            ->first();

        return $attendance?->toLocalTimePayload() ?? [];
    }

    public function breakStart(User $user): array
    {
        return $this->transaction(function () use ($user): array {
            $attendance = Attendance::query()
                ->where('user_id', $user->id)
                ->whereNotNull('clock_in_at')
                ->whereNull('clock_out_at')
                ->latest('clock_in_at')
                ->lockForUpdate()
                ->first();

            if ($attendance === null) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }

            $activeBreak = AttendanceBreak::query()
                ->where('attendance_id', $attendance->id)
                ->whereNotNull('break_start')
                ->whereNull('break_end')
                ->first();

            if ($activeBreak !== null) {
                throw new DomainException('すでに休憩中です', 'ALREADY_ON_BREAK');
            }

            $timezone = $this->resolveTimezone($attendance->work_timezone);
            $now = CarbonImmutable::now($timezone);

            AttendanceBreak::query()->create([
                'attendance_id' => $attendance->id,
                'break_start' => $now->format('H:i:s'),
            ]);

            return $attendance->fresh()->toLocalTimePayload();
        });
    }

    public function breakEnd(User $user): array
    {
        return $this->transaction(function () use ($user): array {
            $attendance = Attendance::query()
                ->where('user_id', $user->id)
                ->whereNotNull('clock_in_at')
                ->whereNull('clock_out_at')
                ->latest('clock_in_at')
                ->lockForUpdate()
                ->first();

            if ($attendance === null) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }

            $activeBreak = AttendanceBreak::query()
                ->where('attendance_id', $attendance->id)
                ->whereNotNull('break_start')
                ->whereNull('break_end')
                ->latest('break_start')
                ->first();

            if ($activeBreak === null) {
                throw new DomainException('休憩中ではありません', 'NOT_ON_BREAK');
            }

            $timezone = $this->resolveTimezone($attendance->work_timezone);
            $now = CarbonImmutable::now($timezone);

            $activeBreak->update([
                'break_end' => $now->format('H:i:s'),
            ]);

            return $attendance->fresh()->toLocalTimePayload();
        });
    }

    public function index(User $user, string $from, string $to): array
    {
        $records = Attendance::query()
            ->where('user_id', $user->id)
            ->whereBetween('work_date', [$from, $to])
            ->orderBy('work_date')
            ->orderBy('clock_in_at')
            ->get();

        return $records->map(fn(Attendance $attendance): array => $attendance->toLocalTimePayload())
            ->values()
            ->all();
    }

    public function store(User $user, array $input): array
    {
        return $this->transaction(function () use ($user, $input): array {
            $payload = $this->buildAttendancePayload($input);

            $attendance = Attendance::query()->create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                ...$payload,
            ]);

            return $attendance->fresh()->toLocalTimePayload();
        });
    }

    public function update(User $user, Attendance $attendance, array $input): array
    {
        if ($attendance->user_id !== $user->id) {
            throw new AuthorizationException('対象データにアクセスできません');
        }

        return $this->transaction(function () use ($attendance, $input): array {
            $base = [
                'work_date' => $attendance->work_date?->toDateString(),
                'clock_in_local_time' => $attendance->clock_in_at?->setTimezone($this->resolveTimezone($attendance->work_timezone))->format('H:i'),
                'clock_out_local_time' => $attendance->clock_out_at?->setTimezone($this->resolveTimezone($attendance->work_timezone))->format('H:i'),
                'clock_out_next_day' => $attendance->isCrossDayShift(),
                'work_timezone' => $this->resolveTimezone($attendance->work_timezone),
                'break_minutes' => $attendance->break_minutes,
                'note' => $attendance->note,
            ];

            $payload = $this->buildAttendancePayload(array_merge($base, $input));
            $attendance->update($payload);

            return $attendance->fresh()->toLocalTimePayload();
        });
    }

    private function buildAttendancePayload(array $input): array
    {
        $timezone = $this->resolveTimezone(Arr::get($input, 'work_timezone'));
        $workDate = (string) Arr::get($input, 'work_date');
        $clockInLocal = (string) Arr::get($input, 'clock_in_local_time');
        $clockOutLocal = Arr::get($input, 'clock_out_local_time');
        $clockOutNextDay = (bool) Arr::get($input, 'clock_out_next_day', false);
        $breakMinutes = (int) Arr::get($input, 'break_minutes', 0);

        $clockInAt = $this->parseLocalDateTime($workDate, $clockInLocal, $timezone);

        $clockOutAt = null;
        if (is_string($clockOutLocal) && $clockOutLocal !== '') {
            $clockOutDate = $clockOutNextDay
                ? $clockInAt->addDay()->toDateString()
                : $workDate;
            $clockOutAt = $this->parseLocalDateTime($clockOutDate, $clockOutLocal, $timezone);

            if ($clockOutAt->lte($clockInAt)) {
                throw new DomainException('退勤時刻は出勤時刻より後である必要があります', 'INVALID_CLOCK_OUT_TIME');
            }
        }

        $workedMinutes = null;
        if ($clockOutAt !== null) {
            $workedMinutes = max(0, $clockInAt->diffInMinutes($clockOutAt) - $breakMinutes);
        }

        return [
            'work_date' => $workDate,
            'work_timezone' => $timezone,
            'clock_in_at' => $clockInAt,
            'clock_out_at' => $clockOutAt,
            'break_minutes' => $breakMinutes,
            'worked_minutes' => $workedMinutes,
            'note' => Arr::get($input, 'note'),
            // 旧カラム互換。将来的には削除する。
            'start_time' => $clockInAt->format('H:i:s'),
            'end_time' => $clockOutAt?->format('H:i:s'),
        ];
    }

    private function parseLocalDateTime(string $date, string $time, string $timezone): CarbonImmutable
    {
        $dateTime = CarbonImmutable::createFromFormat('Y-m-d H:i', sprintf('%s %s', $date, $time), $timezone);

        if ($dateTime === false) {
            throw new DomainException('日時の解釈に失敗しました', 'DATETIME_PARSE_ERROR');
        }

        return $dateTime;
    }
}
