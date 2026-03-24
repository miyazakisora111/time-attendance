<?php

declare(strict_types=1);

namespace App\Application\Services;

use App\Application\Queries\AttendanceQuery;
use App\Exceptions\DomainException;
use App\Models\Attendance;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * 勤怠のサービス
 */
final class AttendanceService extends BaseService
{

    /**
     * コンストラクタ
     * 
     * @param AttendanceQuery $query 勤怠のクエリ
     */
    public function __construct(
        private AttendanceQuery $query,
    ) {}

    /**
     * 出勤を打刻する
     * 
     * @param User $user ユーザー
     * @return array
     */
    public function clockIn(User $user): array
    {
        return $this->transaction(function () use ($user): array {

            // 退勤チェック
            $attendance = $this->query->findOpenAttendance(user: $user);
            if ($attendance) {
                throw new DomainException('未退勤の勤務が存在します', 'OPEN_ATTENDANCE_EXISTS');
            }

            // 勤怠テーブルに登録する。
            $timezone = $this->resolveTimezone($user->timezone ?? null);
            $now = CarbonImmutable::now($timezone);
            $attendance = Attendance::query()->create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'work_date' => $now->toDateString(),
                'clock_in_at' => $now,
                'work_timezone' => $timezone,
            ]);

            return $attendance->toLocalTimePayload();
        });
    }

    /**
     * 出勤を打刻する
     * 
     * @param User $user ユーザー
     * @return array
     */
    public function clockOut(User $user): array
    {
        return $this->transaction(function () use ($user): array {

            // 出勤チェック
            $attendance = $this->query->findOpenAttendance(user: $user);
            if (!$attendance) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }

            $attendance->assertCanClockOut();

            $timezone = $this->resolveTimezone($attendance->work_timezone);
            $now = CarbonImmutable::now($timezone);

            $attendance->recalculateBreakMinutes();
            $attendance->refresh();

            $workedMinutes = max(
                0,
                $attendance->clock_in_at->diffInMinutes($now) - (int) $attendance->break_minutes
            );

            $attendance->update([
                'clock_out_at' => $now,
                'worked_minutes' => $workedMinutes,
                'end_time' => $now->format('H:i:s'),
            ]);

            return $attendance->toLocalTimePayload();
        });
    }
}
