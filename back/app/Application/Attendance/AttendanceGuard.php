<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Models\Attendance;
use App\Exceptions\DomainException;
use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠のガード
 */
final class AttendanceGuard
{
    /**
     * コンストラクタ
     *
     * @param AttendanceResolver $resolver 勤怠に関する状態を判定するクラス
     */
    public function __construct(
        private readonly AttendanceResolver $resolver,
    ) {}

    /**
     * 出勤可能か検証する
     *
     * @param Attendance $attendance 勤怠
     * @throws DomainException
     */
    public function assertCanClockIn(Attendance $attendance): void
    {
        $this->assertAllowed(
            attendance: $attendance,
            allowed: [ClockStatus::OUT->value],
            errors: [
                ClockStatus::IN->value => ['すでに出勤しています', 'ALREADY_CLOCKED_IN'],
                ClockStatus::BREAK->value => ['休憩中です', 'ON_BREAK'],
            ],
        );
    }

    /**
     * 退勤可能か検証する
     *
     * @param Attendance $attendance 勤怠
     * @throws DomainException
     */
    public function assertCanClockOut(Attendance $attendance): void
    {
        $this->assertAllowed(
            attendance: $attendance,
            allowed: [ClockStatus::IN->value],
            errors: [
                ClockStatus::BREAK->value => ['休憩中は退勤できません。先に休憩を終了してください', 'CANNOT_CLOCK_OUT_ON_BREAK'],
                ClockStatus::OUT->value => ['出勤していません', 'NOT_CLOCKED_IN'],
            ],
        );
    }

    /**
     * 休憩開始可能か検証する
     *
     * @param Attendance $attendance 勤怠
     * @throws DomainException
     */
    public function assertCanBreakStart(Attendance $attendance): void
    {
        $this->assertAllowed(
            attendance: $attendance,
            allowed: [ClockStatus::IN->value],
            errors: [
                ClockStatus::BREAK->value => ['すでに休憩中です', 'ALREADY_ON_BREAK'],
                ClockStatus::OUT->value => ['出勤していません', 'NOT_CLOCKED_IN'],
            ],
        );
    }

    /**
     * 休憩終了可能か検証する
     *
     * @param Attendance $attendance 勤怠
     * @throws DomainException
     */
    public function assertCanBreakEnd(Attendance $attendance): void
    {
        $this->assertAllowed(
            attendance: $attendance,
            allowed: [ClockStatus::BREAK->value],
            errors: [
                ClockStatus::IN->value => ['休憩中ではありません', 'NOT_ON_BREAK'],
                ClockStatus::OUT->value => ['出勤していません', 'NOT_CLOCKED_IN'],
            ],
        );
    }

    /**
     * 共通の検証処理
     *
     * @param Attendance $attendance
     * @param ClockStatus[] $allowed 許可された打刻状態
     * @param array $errors ClockStatus => [message, errorCode]
     * @throws DomainException
     */
    private function assertAllowed(
        Attendance $attendance,
        array $allowed,
        array $errors,
    ): void {
        $clockStatus = $this->resolver->resolveClockStatus($attendance);

        if (in_array($clockStatus, $allowed, true)) {
            return;
        }

        if (isset($errors[$clockStatus->value])) {
            [$message, $code] = $errors[$clockStatus->value];
            throw new DomainException($message, $code);
        }

        throw new DomainException('不正な状態です', 'INVALID_CLOCK_STATUS');
    }
}
