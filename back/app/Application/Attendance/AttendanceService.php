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
     * @param AttendanceGuard $guard 勤怠のガード
     * @param AttendanceResolver $resolver 勤怠リゾルバ
     */
    public function __construct(
        private readonly AttendanceQuery $query,
        private readonly AttendanceGuard $guard,
        private readonly AttendanceResolver $resolver,
    ) {}

    /**
     * 本日の勤怠情報を取得する
     *
     * @param User $user ユーザー
     * @return ?Attendance
     */
    public function getToday(User $user): ?Attendance
    {
        return $this->query->today($user);
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
            $latestAttendance = $this->query->findLatestAttendance(user: $user);
            if ($latestAttendance && !$latestAttendance->isClockedOut()) {
                throw new DomainException('未退勤の勤務が存在します', 'OPEN_ATTENDANCE_EXISTS');
            }
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanClockIn($clockStatus);

            // 勤怠テーブルに登録する。
            $timezone = $this->resolveTimezone(timezone: $user->timezone);
            $now = CarbonImmutable::now($timezone);
            $attendance = Attendance::query()->create([
                'user_id' => $user->id,
                'work_date' => $now->toDateString(),
                'clock_in_at' => $now,
                'work_timezone' => $timezone,
            ]);

            return $attendance;
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
            $latestAttendance = $this->query->findLatestAttendance(user: $user);
            if (!$latestAttendance || $latestAttendance->isClockedOut()) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanClockOut($clockStatus);

            // 勤怠テーブルを更新する。
            $timezone = $this->resolveTimezone($latestAttendance->work_timezone);
            $now = CarbonImmutable::now($timezone);
            $latestAttendance->update([
                'clock_out_at' => $now,
            ]);

            return $latestAttendance;
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
            $latestAttendance = $this->query->findLatestAttendance(user: $user);
            if (!$latestAttendance) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanBreakStart($clockStatus);

            // 勤怠休憩テーブルに登録する。
            $timezone = $this->resolveTimezone($latestAttendance->work_timezone);
            $now = CarbonImmutable::now($timezone);
            AttendanceBreak::query()->create([
                'attendance_id' => $latestAttendance->id,
                'break_start' => $now->format('H:i:s'),
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
            $latestAttendance = $this->query->findLatestAttendance(user: $user);
            if (!$latestAttendance) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }
            $latestAttendanceBreak = $this->query->findLatestAttendanceBreak($latestAttendance->id);
            if (!$latestAttendanceBreak) {
                throw new DomainException('休憩中ではありません', 'NOT_ON_BREAK');
            }
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanBreakEnd($clockStatus);

            // 勤怠休憩テーブルを更新する。
            $timezone = $this->resolveTimezone($latestAttendance->work_timezone);
            $now = CarbonImmutable::now($timezone);
            $latestAttendanceBreak->update([
                'break_end' => $now->format('H:i:s'),
            ]);

            return $latestAttendance;
        });
    }

    /**
     * 勤怠一覧を取得する
     *
     * @param User $user ユーザー
     * @param string $from 開始日
     * @param string $to 終了日
     * @return array<int, array<string, mixed>> 勤怠一覧
     */
    public function index(User $user, string $from, string $to): array
    {
        return $this->query->list($user, $from, $to);
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
            $attendance = Attendance::query()->create([
                'user_id' => $user->id,
                'work_date' => $input['work_date'],
                'clock_in_at' => $input['clock_in_at'] ?? null,
                'clock_out_at' => $input['clock_out_at'] ?? null,
                'work_timezone' => $input['work_timezone'] ?? $this->resolveTimezone(timezone: $user->timezone),
            ]);

            // 勤怠データを生成して返す。
            return $attendance;
        });
    }

    /**
     * 勤怠を更新する
     *
     * @param User $user ユーザー
     * @param Attendance $attendance 更新対象の勤怠
     * @param array<string, mixed> $input 入力値
     * @return Attendance 勤怠
     */
    public function update(User $user, Attendance $attendance, array $input): Attendance
    {
        return $this->transaction(function () use ($user, $attendance, $input): Attendance {
            $attendance->update(array_filter([
                'clock_in_at' => $input['clock_in_at'] ?? null,
                'clock_out_at' => $input['clock_out_at'] ?? null,
            ], fn($v) => $v !== null));

            // 勤怠データを生成して返す。
            return $attendance;
        });
    }
}
