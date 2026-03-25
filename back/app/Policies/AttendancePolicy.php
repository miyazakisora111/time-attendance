<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\Attendance;

/**
 * 勤怠に関する認可ルール
 *
 * - 作成・更新・削除: 管理者または本人
 * - 参照: 管理者または本人
 */
class AttendancePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Attendance $attendance): bool
    {
        return $this->isAdminOrOwner($user, $attendance);
    }

    public function create(User $user, Attendance $attendance): bool
    {
        return $this->isAdminOrOwner($user, $attendance);
    }

    public function update(User $user, Attendance $attendance): bool
    {
        return $this->isAdminOrOwner($user, $attendance);
    }

    public function delete(User $user, Attendance $attendance): bool
    {
        return $this->isAdminOrOwner($user, $attendance);
    }

    private function isAdminOrOwner(User $user, Attendance $attendance): bool
    {
        return $user->isAdmin() || $attendance->user_id === $user->id;
    }
}
