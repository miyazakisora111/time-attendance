<?php

declare(strict_types=1);

namespace App\Application\Attendance;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠の「現在の状態」を計算する責務を持つクラス。
 *
 * - DB アクセスは行わない（渡された Attendance モデルだけで判定する）
 * - 状態遷移の「許可/拒否」は AttendanceGuard の責務
 */
final class AttendanceResolver
{
    /**
     * 勤怠モデルから現在の打刻状態を判定する。
     *
     * 判定ルール:
     *   1. 勤務中でない（未出勤 or 退勤済み） → OUT
     *   2. 未終了の休憩レコードがある           → BREAK
     *   3. それ以外                             → IN
     */
    public function resolveClockStatus(?Attendance $attendance): ClockStatus
    {
        // 勤務中の勤怠が無い → 退勤状態
        if ($attendance === null || !$attendance->isWorking()) {
            return ClockStatus::OUT;
        }

        // 勤務中 かつ 未終了の休憩がある → 休憩状態
        if ($this->hasActiveBreak($attendance)) {
            return ClockStatus::BREAK;
        }

        // 勤務中 かつ 休憩なし → 出勤状態
        return ClockStatus::IN;
    }

    /**
     * 勤怠に未終了（break_end IS NULL）の休憩レコードがあるか。
     */
    public function hasActiveBreak(Attendance $attendance): bool
    {
        $attendance->loadMissing('breaks');

        return $attendance->breaks
            ->contains(fn(AttendanceBreak $b) => $b->isBreaking());
    }

    /**
     * 勤怠の未終了の休憩レコードを返す。存在しない場合は null。
     */
    public function findActiveBreak(Attendance $attendance): ?AttendanceBreak
    {
        $attendance->loadMissing('breaks');

        return $attendance->breaks
            ->first(fn(AttendanceBreak $b) => $b->isBreaking());
    }
}
