<?php

declare(strict_types=1);

namespace App\Infrastructure\Team\Query;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * チームのクエリ
 */
final class TeamQuery
{
    /**
     * 同一部署のメンバー一覧を取得する。
     *
     * @param User $user 認証済みユーザー
     * @return Collection<int, User> メンバー一覧（部署・役職ロード済み）
     */
    public function getMembers(User $user): Collection
    {
        return User::query()
            ->active()
            ->where('department_id', $user->department_id)
            ->with(['department', 'role'])
            ->ordered()
            ->get();
    }

    /**
     * 指定ユーザーの本日の勤怠を取得する。
     *
     * @param string $userId ユーザーID
     * @param string $today 本日日付（Y-m-d）
     * @return ?\App\Models\Attendance 本日の勤怠
     */
    public function getTodayAttendance(string $userId, string $today): ?\App\Models\Attendance
    {
        return \App\Models\Attendance::query()
            ->forUser($userId)
            ->where('work_date', $today)
            ->latest('clock_in_at')
            ->first();
    }
}
