<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Models\Attendance;
use App\Exceptions\DomainException;
use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠のポリシー
 */
final class AttendancePolicy
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
     * 退勤可能か検証する。
     *
     * @param Attendance $attendance 勤怠
     * @throws DomainException
     */
    public function assertCanClockOut(Attendance $attendance): void
    {
        $this->assertAllowed(
            attendance: $attendance,
            allowed: [ClockStatus::IN],
            errors: [
                ClockStatus::BREAK => ['休憩中は退勤できません。先に休憩を終了してください', 'CANNOT_CLOCK_OUT_ON_BREAK'],
                ClockStatus::OUT => ['出勤していません', 'NOT_CLOCKED_IN'],
            ],
        );
    }

    /**
     * 休憩開始可能か検証する。
     *
     * @param Attendance $attendance 勤怠
     * @throws DomainException
     */
    public function assertCanBreakStart(Attendance $attendance): void
    {
        $this->assertAllowed(
            attendance: $attendance,
            allowed: [ClockStatus::IN],
            errors: [
                ClockStatus::BREAK => ['すでに休憩中です', 'ALREADY_ON_BREAK'],
                ClockStatus::OUT => ['出勤していません', 'NOT_CLOCKED_IN'],
            ],
        );
    }

    /**
     * 共通の検証
     * 
     * @param Attendance $attendance 勤怠
     * @param array $allowed 許可された打刻状態
     * @param array $errors エラーケース
     * @throws DomainException 
     */
    private function assertAllowed(
        Attendance $attendance,
        array $allowed,
        array $errors,
    ): void {

        // 打刻状態を取得する
        $clockStatus = $this->resolver->resolveClockStatus($attendance);
        if (in_array($clockStatus, $allowed, true)) {
            return;
        }

        // エラーケースの処理
        if (isset($errors[$clockStatus])) {
            [$message, $code] = $errors[$clockStatus];
            throw new DomainException($message, $code);
        }

        // 想定外の状態の場合
        throw new DomainException('不正な状態です', 'INVALID_CLOCK_STATUS');
    }
}
