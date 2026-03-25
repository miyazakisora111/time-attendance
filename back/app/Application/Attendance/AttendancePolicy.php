<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Models\Attendance;
use App\Exceptions\DomainException;
use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠に対する行為可否を検証するポリシー。
 *
 * - 状態を変更しない
 * - 業務ルール違反時は DomainException を投げる
 * - HTTP / Auth / DB には依存しない
 */
final class AttendancePolicy
{
    public function __construct(
        private readonly AttendanceResolver $resolver,
    ) {}

    /**
     * 退勤可能か検証する。
     *
     * @throws DomainException
     */
    public function assertCanClockOut(Attendance $attendance): void
    {
        $this->assertAllowed(
            $attendance,
            allowed: [ClockStatus::IN],
            errors: [
                ClockStatus::BREAK => [
                    '休憩中は退勤できません。先に休憩を終了してください',
                    'CANNOT_CLOCK_OUT_ON_BREAK',
                ],
                ClockStatus::OUT => [
                    '出勤していません',
                    'NOT_CLOCKED_IN',
                ],
            ],
        );
    }

    /**
     * 休憩開始可能か検証する。
     *
     * @throws DomainException
     */
    public function assertCanBreakStart(Attendance $attendance): void
    {
        $this->assertAllowed(
            $attendance,
            allowed: [ClockStatus::IN],
            errors: [
                ClockStatus::BREAK => [
                    'すでに休憩中です',
                    'ALREADY_ON_BREAK',
                ],
                ClockStatus::OUT => [
                    '出勤していません',
                    'NOT_CLOCKED_IN',
                ],
            ],
        );
    }

    /**
     * 共通検証ロジック
     */
    private function assertAllowed(
        Attendance $attendance,
        array $allowed,
        array $errors,
    ): void {
        $status = $this->resolver->resolve($attendance);

        if (in_array($status, $allowed, true)) {
            return;
        }

        if (isset($errors[$status])) {
            [$message, $code] = $errors[$status];
            throw new DomainException($message, $code);
        }

        throw new DomainException('不正な状態です', 'INVALID_CLOCK_STATUS');
    }
}
