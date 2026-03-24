<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\DomainException;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use App\Models\AttendanceBreak;
use Carbon\CarbonImmutable;
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
                ->lockForUpdate()
                ->first();

            if ($attendance === null) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }

            // 状態ベースのガード（時刻比較ではなく状態で制御する）
            $attendance->assertCanClockOut();

            $timezone = $this->resolveTimezone($attendance->work_timezone);
            $now = CarbonImmutable::now($timezone);

            // break_minutes を AttendanceBreak から再計算
            $attendance->recalculateBreakMinutes();
            $attendance->refresh();

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

        return $attendance?->toLocalTimePayload() ?? [
            'userId' => $user->id,
            'workDate' => $today,
            'clockStatus' => 'out',
            'startTime' => null,
        ];
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

            // 状態ベースのガード（個別の break クエリによる重複チェックを排除）
            $attendance->assertCanBreakStart();

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

            // 状態ベースのガード
            $attendance->assertCanBreakEnd();

            $activeBreak = AttendanceBreak::query()
                ->where('attendance_id', $attendance->id)
                ->whereNotNull('break_start')
                ->whereNull('break_end')
                ->latest('break_start')
                ->first();

            $timezone = $this->resolveTimezone($attendance->work_timezone);
            $now = CarbonImmutable::now($timezone);

            $activeBreak->update([
                'break_end' => $now->format('H:i:s'),
            ]);

            // break_minutes を再計算
            $attendance->recalculateBreakMinutes();

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
            $timezone = $this->resolveTimezone($user->timezone ?? null);
            $workDate = (string) $input['workDate'];

            $clockInAt = CarbonImmutable::parse($input['startTime']);
            $clockOutAt = isset($input['endTime']) && $input['endTime'] !== null
                ? CarbonImmutable::parse($input['endTime'])
                : null;

            if ($clockOutAt !== null && $clockOutAt->lte($clockInAt)) {
                throw new DomainException('退勤時刻は出勤時刻より後である必要があります', 'INVALID_CLOCK_OUT_TIME');
            }

            $workedMinutes = null;
            if ($clockOutAt !== null) {
                $workedMinutes = max(0, $clockInAt->diffInMinutes($clockOutAt));
            }

            $attendance = Attendance::query()->create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'work_date' => $workDate,
                'work_timezone' => $timezone,
                'clock_in_at' => $clockInAt,
                'clock_out_at' => $clockOutAt,
                'break_minutes' => 0,
                'worked_minutes' => $workedMinutes,
                'note' => $input['note'] ?? null,
                // 旧カラム互換
                'start_time' => $clockInAt->setTimezone($timezone)->format('H:i:s'),
                'end_time' => $clockOutAt?->setTimezone($timezone)->format('H:i:s'),
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
            $timezone = $this->resolveTimezone($attendance->work_timezone);

            $clockInAt = isset($input['startTime']) && $input['startTime'] !== null
                ? CarbonImmutable::parse($input['startTime'])
                : $attendance->clock_in_at;

            $clockOutAt = array_key_exists('endTime', $input)
                ? ($input['endTime'] !== null ? CarbonImmutable::parse($input['endTime']) : null)
                : $attendance->clock_out_at;

            if ($clockOutAt !== null && $clockInAt !== null && $clockOutAt->lte($clockInAt)) {
                throw new DomainException('退勤時刻は出勤時刻より後である必要があります', 'INVALID_CLOCK_OUT_TIME');
            }

            $breakMinutes = $attendance->break_minutes ?? 0;
            $workedMinutes = null;
            if ($clockInAt !== null && $clockOutAt !== null) {
                $workedMinutes = max(0, $clockInAt->diffInMinutes($clockOutAt) - $breakMinutes);
            }

            $attendance->update([
                'clock_in_at' => $clockInAt,
                'clock_out_at' => $clockOutAt,
                'worked_minutes' => $workedMinutes,
                'note' => $input['note'] ?? $attendance->note,
                // 旧カラム互換
                'start_time' => $clockInAt?->setTimezone($timezone)->format('H:i:s'),
                'end_time' => $clockOutAt?->setTimezone($timezone)->format('H:i:s'),
            ]);

            return $attendance->fresh()->toLocalTimePayload();
        });
    }
}
