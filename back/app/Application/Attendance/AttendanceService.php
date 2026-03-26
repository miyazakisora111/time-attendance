<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Application\BaseService;
use App\Exceptions\DomainException;
use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\User;
use App\Data\AttendanceData;
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
     * @param AttendanceDataFactory $factory 勤怠データのファクトリ
     */
    public function __construct(
        private readonly AttendanceQuery $query,
        private readonly AttendanceGuard $guard,
        private readonly AttendanceResolver $resolver,
        private readonly AttendanceDataFactory $factory,
    ) {}

    /**
     * 本日の勤怠情報を取得する
     *
     * @param User $user ユーザー
     * @return Collection<Attendance>
     */
    public function getToday(User $user): Collection
    {
        return $this->query->today($user);
    }

    /**
     * 出勤を打刻する
     * 
     * @param User $user ユーザー
     * @return AttendanceData 勤怠データ
     */
    public function clockIn(User $user): AttendanceData
    {
        return $this->transaction(function () use ($user): AttendanceData {

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

            // 勤怠データを生成して返す。
            return $this->factory->createFromModel($attendance);
        });
    }

    /**
     * 退勤を打刻する
     * 
     * @param User $user ユーザー
     * @return AttendanceData 勤怠データ
     */
    public function clockOut(User $user): AttendanceData
    {
        return $this->transaction(function () use ($user): AttendanceData {

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

            // 勤怠データを生成して返す。
            return $this->factory->createFromModel($latestAttendance);
        });
    }

    /**
     * 休憩を開始する
     *
     * @param User $user ユーザー
     * @return AttendanceData 勤怠データ
     */
    public function breakStart(User $user): AttendanceData
    {
        return $this->transaction(function () use ($user): AttendanceData {

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

            // 勤怠データを生成して返す。
            return $this->factory->createFromModel($latestAttendance);
        });
    }

    /**
     * 休憩を終了する
     *
     * @param User $user ユーザー
     * @return AttendanceData 勤怠データ
     */
    public function breakEnd(User $user): AttendanceData
    {
        return $this->transaction(function () use ($user): AttendanceData {

            // 休憩終了可能か検証する。
            $latestAttendance = $this->query->findLatestAttendance(user: $user);
            if (!$latestAttendance) {
                throw new DomainException('出勤していません', 'NOT_CLOCKED_IN');
            }
            $breakingAttendance = $this->query->findBreakingAttendance($latestAttendance->id);
            if (!$breakingAttendance) {
                throw new DomainException('休憩中ではありません', 'NOT_ON_BREAK');
            }
            $clockStatus = $this->resolver->resolveClockStatus($latestAttendance);
            $this->guard->assertCanBreakEnd($clockStatus);

            // 勤怠休憩テーブルを更新する。
            $timezone = $this->resolveTimezone($latestAttendance->work_timezone);
            $now = CarbonImmutable::now($timezone);
            $breakingAttendance->update([
                'break_end' => $now->format('H:i:s'),
            ]);

            // 勤怠データを生成して返す。
            return $this->factory->createFromModel($latestAttendance);
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
     * @return AttendanceData 勤怠データ
     */
    public function store(User $user, array $input): AttendanceData
    {
        return $this->transaction(function () use ($user, $input): AttendanceData {
            $attendance = Attendance::query()->create([
                'user_id' => $user->id,
                'work_date' => $input['work_date'],
                'clock_in_at' => $input['clock_in_at'] ?? null,
                'clock_out_at' => $input['clock_out_at'] ?? null,
                'work_timezone' => $input['work_timezone'] ?? $this->resolveTimezone(timezone: $user->timezone),
            ]);

            // 勤怠データを生成して返す。
            return $this->factory->createFromModel($attendance);
        });
    }

    /**
     * 勤怠を更新する
     *
     * @param User $user ユーザー
     * @param Attendance $attendance 更新対象の勤怠
     * @param array<string, mixed> $input 入力値
     * @return AttendanceData 勤怠データ
     */
    public function update(User $user, Attendance $attendance, array $input): AttendanceData
    {
        return $this->transaction(function () use ($user, $attendance, $input): AttendanceData {
            $attendance->update(array_filter([
                'clock_in_at' => $input['clock_in_at'] ?? null,
                'clock_out_at' => $input['clock_out_at'] ?? null,
            ], fn($v) => $v !== null));

            // 勤怠データを生成して返す。
            return $this->factory->createFromModel($attendance);
        });
    }
}
