<?php

declare(strict_types=1);

namespace App\Infrastructure\Attendance\Query;

use App\Infrastructure\BaseQuery;
use App\Models\Attendance;
use App\Models\AttendanceBreak;
use App\Models\User;

/**
 * 勤怠のクエリ
 */
final class AttendanceQuery extends BaseQuery
{
    /**
     * 勤怠一覧を取得する
     * 
     * @param User $user ユーザー
     * @param string $from 開始日
     * @param string $to 終了日
     * @return array[] 勤怠一覧
     */
    public function list(User $user, string $from, string $to): array
    {
        return Attendance::query()
            ->forUser($user->id)
            ->whereBetween('work_date', [$from, $to])
            ->orderBy('work_date')
            ->orderBy('clock_in_at')
            ->get()
            ->map(fn(Attendance $a) => $a->toLocalTimePayload())
            ->values()
            ->all();
    }

    /**
     * 最新の勤怠を取得する。
     *
     * @param User $user ユーザー
     * @return ?Attendance 最新の勤怠
     */
    public function getLatestAttendance(User $user): ?Attendance
    {
        return Attendance::query()
            ->forUser($user->id)
            ->latest('clock_in_at')
            ->first();
    }

    /**
     * 最新の休憩を取得する。
     *
     * @param Attendance $attendance 勤怠
     * @return ?AttendanceBreak 最新の休憩
     */
    public function getLatestAttendanceBreak(Attendance $attendance): ?AttendanceBreak
    {
        return $attendance
            ->breaks()
            ->latest('break_start_at')
            ->first();
    }

    /**
     * 勤怠詳細を取得する。
     *
     * @param User $user ユーザー
     * @return ?object 詳細行
     */
    public function getDetail(User $user): ?object
    {
        $sql = $this->loadSql('attendance_detail.sql');

        return $this->selectOne($sql, [
            'user_id' => $user->id,
            'work_date' => now()->toDateString(),
        ]);
    }
}
