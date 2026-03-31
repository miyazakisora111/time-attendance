<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Application\BaseService;
use App\Infrastructure\Attendance\Persistence\AttendanceRepository;
use App\Infrastructure\Attendance\Query\AttendanceQuery;
use App\Models\Attendance;
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
     * @param AttendanceRepository $repository 勤怠のリポジトリ
     * @param AttendanceGuard $guard 勤怠のガード
     * @param AttendanceResolver $resolver 勤怠リゾルバ
     */
    public function __construct(
        private readonly AttendanceQuery $query,
        private readonly AttendanceRepository $repository,
        private readonly AttendanceGuard $guard,
        private readonly AttendanceResolver $resolver,
    ) {}

    /**
     * 本日の勤怠情報を取得する
     *
     * @param User $user ユーザー
     * @return ?Attendance
     */
    public function getLatestAttendance(User $user): ?Attendance
    {
        return $this->query->getLatestAttendance($user);
    }

    /**
     * 出勤を打刻する
     * 
     * @param User $user ユーザー
     * @return Attendance 勤怠
     */
    public function clockIn(User $user): Attendance
    {
        return $this->transaction(function () use ($user): Attendance {

            // 出勤可能か検証する。
            $latestAttendance = $this->query->getLatestAttendance($user);
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanClockIn($clockStatus);

            // 勤怠テーブルに登録する。
            $timezone = $this->resolveTimezone(timezone: $user->timezone);
            $now = CarbonImmutable::now($timezone);

            return $this->repository->create([
                'user_id' => $user->id,
                'work_date' => $now->toDateString(),
                'clock_in_at' => $now,
                'work_timezone' => $timezone,
            ]);
        });
    }

    /**
     * 退勤を打刻する
     * 
     * @param User $user ユーザー
     * @return Attendance 勤怠
     */
    public function clockOut(User $user): Attendance
    {
        return $this->transaction(function () use ($user): Attendance {

            // 退勤可能か検証する。
            $latestAttendance = $this->query->getLatestAttendance($user);
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanClockOut($clockStatus);

            // 勤怠テーブルを更新する。
            $timezone = $this->resolveTimezone($latestAttendance->work_timezone);
            $now = CarbonImmutable::now($timezone);

            return $this->repository->update($latestAttendance, [
                'clock_out_at' => $now,
            ]);
        });
    }

    /**
     * 休憩を開始する
     *
     * @param User $user ユーザー
     * @return Attendance 勤怠
     */
    public function breakStart(User $user): Attendance
    {
        return $this->transaction(function () use ($user): Attendance {

            // 休憩開始可能か検証する。
            $latestAttendance = $this->query->getLatestAttendance($user);
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanBreakStart($clockStatus);

            // 勤怠休憩テーブルに登録する。
            $timezone = $this->resolveTimezone($latestAttendance->work_timezone);
            $now = CarbonImmutable::now($timezone);
            $this->repository->createBreak([
                'attendance_id' => $latestAttendance->id,
                'break_start_at' => $now->format('H:i:s'),
            ]);

            return $latestAttendance;
        });
    }

    /**
     * 休憩を終了する
     *
     * @param User $user ユーザー
     * @return Attendance 勤怠
     */
    public function breakEnd(User $user): Attendance
    {
        return $this->transaction(function () use ($user): Attendance {

            // 休憩終了可能か検証する。
            $latestAttendance = $this->query->getLatestAttendance($user);
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanBreakEnd($clockStatus);

            // 勤怠休憩テーブルを更新する。
            $timezone = $this->resolveTimezone($latestAttendance->work_timezone);
            $now = CarbonImmutable::now($timezone);
            $latestAttendanceBreak = $this->query->getLatestAttendanceBreak($latestAttendance);
            $this->repository->updateBreak($latestAttendanceBreak, [
                'break_end_at' => $now->format('H:i:s'),
            ]);

            return $latestAttendance;
        });
    }

    /**
     * 勤怠を新規登録する
     *
     * @param User $user ユーザー
     * @param array<string, mixed> $input 入力値
     * @return Attendance 勤怠
     */
    public function store(User $user, array $input): Attendance
    {
        return $this->transaction(function () use ($user, $input): Attendance {
            return $this->repository->create([
                'user_id' => $user->id,
                'work_date' => $input['work_date'],
                'clock_in_at' => $input['clock_in_at'] ?? null,
                'clock_out_at' => $input['clock_out_at'] ?? null,
                'work_timezone' => $input['work_timezone'] ?? $this->resolveTimezone(timezone: $user->timezone),
            ]);
        });
    }

    /**
     * 勤怠を更新する
     *
     * @param Attendance $attendance 更新対象の勤怠
     * @param array<string, mixed> $input 入力値
     * @return Attendance 勤怠
     */
    public function update(Attendance $attendance, array $input): Attendance
    {
        return $this->transaction(function () use ($attendance, $input): Attendance {
            $this->repository->update($attendance, array_filter([
                'clock_in_at' => $input['clock_in_at'] ?? null,
                'clock_out_at' => $input['clock_out_at'] ?? null,
            ], fn($v) => $v !== null));

            return $attendance;
        });
    }
}
