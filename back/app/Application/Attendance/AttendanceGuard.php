<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Exceptions\DomainException;
use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠のガード
 */
final class AttendanceGuard
{
    /**
     * 出勤可能か検証する
     *
     * @param ClockStatus $clockStatus 打刻状態
     * @throws DomainException
     */
    public function assertCanClockIn(ClockStatus $clockStatus): void
    {
        $this->assertAllowed(
            clockStatus: $clockStatus,
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
     * @param ClockStatus $clockStatus 打刻状態
     * @throws DomainException
     */
    public function assertCanClockOut(ClockStatus $clockStatus): void
    {
        $this->assertAllowed(
            clockStatus: $clockStatus,
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
     * @param ClockStatus $clockStatus 打刻状態
     * @throws DomainException
     */
    public function assertCanBreakStart(ClockStatus $clockStatus): void
    {
        $this->assertAllowed(
            clockStatus: $clockStatus,
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
     * @param ClockStatus $clockStatus 打刻状態
     * @throws DomainException
     */
    public function assertCanBreakEnd(ClockStatus $clockStatus): void
    {
        $this->assertAllowed(
            clockStatus: $clockStatus,
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
     * @param ClockStatus $clockStatus
     * @param string[] $allowed 許可された打刻状態
     * @param array $errors 許可されなかった打刻状態とエラーメッセージのマップ
     * @throws DomainException
     */
    private function assertAllowed(
        ClockStatus $clockStatus,
        array $allowed,
        array $errors,
    ): void {

        // 例外が発生しない場合は許可された状態なので処理を終了する。
        $clockStatusValue = $clockStatus->value;
        if (in_array($clockStatusValue, $allowed, true)) {
            return;
        }

        // 許可されていない状態の場合はエラーをスローする
        if (isset($errors[$clockStatusValue])) {
            [$message, $code] = $errors[$clockStatusValue];
            throw new DomainException($message, $code);
        }

        throw new DomainException('不正な状態です', 'INVALID_CLOCK_STATUS');
    }
}
