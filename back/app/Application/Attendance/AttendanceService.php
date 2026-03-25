<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Application\BaseService;
use App\Exceptions\DomainException;
use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\User;
use Carbon\CarbonImmutable;

/**
 * 勤怠のサービス
 */
final class AttendanceService extends BaseService
{
    /**
     * コンストラクタ
     * 
     * @param AttendanceQuery $query 勤怠のクエリ
     * @param AttendancePolicy $policy 勤怠のポリシー
     */
    public function __construct(
        private AttendanceQuery $query,
        private AttendancePolicy $policy,
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
            $attendance = $this->query->findWorkingAttendance(user: $user);
            if ($attendance) {
                throw new DomainException('未退勤の勤務が存在します', 'OPEN_ATTENDANCE_EXISTS');
            }

            // 勤怠テーブルに登録する。
            $timezone = $this->resolveTimezone(timezone: $user->timezone);
            $now = CarbonImmutable::now($timezone);
            $attendance = Attendance::query()->create([
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
            $attendance = $this->query->findWorkingAttendance(user: $user);
            if (!$attendance) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }

            // 退勤可能か検証する。
            $this->policy->assertCanClockOut($attendance);

            // 合計休憩時間を計算する。
            $breakMinutes = $this->calculateBreakMinutes($attendance->id);

            // 勤務時間を計算する。
            $timezone = $this->resolveTimezone($attendance->work_timezone);
            $now = CarbonImmutable::now($timezone);
            $workedMinutes = max(0, $attendance->clock_in_at->diffInMinutes($now) - $breakMinutes);

            // 勤怠テーブルを更新する。
            $attendance->update([
                'clock_out_at' => $now,
                'break_minutes' => $breakMinutes,
                'worked_minutes' => $workedMinutes,
            ]);

            return $attendance->toLocalTimePayload();
        });
    }

    /**
     * 合計休憩時間を計算する。
     * 
     * @param string $attendanceId 勤怠ID
     * @return int 合計休憩時間（分）
     */
    private function calculateBreakMinutes(string $attendanceId): int
    {
        // 休憩が終了済みの勤怠を取得する。
        $completedBreaks = $this->query->findCompletedBreaks($attendanceId);

        // 休憩時間を合算する。
        return $completedBreaks->sum(fn(AttendanceBreak $break) => $break->breakMinutes());
    }
}
