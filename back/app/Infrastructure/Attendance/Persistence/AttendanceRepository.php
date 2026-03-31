<?php

declare(strict_types=1);

namespace App\Infrastructure\Attendance\Persistence;

use App\Models\Attendance;
use App\Models\AttendanceBreak;

/**
 * 勤怠のリポジトリ
 */
final class AttendanceRepository
{
    /**
     * 勤怠を新規作成する
     *
     * @param array<string, mixed> $attributes
     * @return Attendance
     */
    public function create(array $attributes): Attendance
    {
        return Attendance::query()->create($attributes);
    }

    /**
     * 勤怠を更新する
     *
     * @param Attendance $attendance
     * @param array<string, mixed> $attributes
     * @return Attendance
     */
    public function update(Attendance $attendance, array $attributes): Attendance
    {
        $attendance->update($attributes);

        return $attendance->refresh();
    }

    /**
     * 休憩を新規作成する
     *
     * @param array<string, mixed> $attributes
     * @return AttendanceBreak
     */
    public function createBreak(array $attributes): AttendanceBreak
    {
        return AttendanceBreak::query()->create($attributes);
    }

    /**
     * 休憩を更新する
     *
     * @param AttendanceBreak $break
     * @param array<string, mixed> $attributes
     * @return AttendanceBreak
     */
    public function updateBreak(AttendanceBreak $break, array $attributes): AttendanceBreak
    {
        $break->update($attributes);

        return $break->refresh();
    }
}
