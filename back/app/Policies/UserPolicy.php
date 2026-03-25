<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;


/**
 * ユーザーに関する認可ルール
 *
 * - 作成・削除: 管理者のみ
 * - 更新・参照: 管理者または本人
 */
class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, User $target): bool
    {
        return $this->isAdminOrSelf($user, $target);
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $target): bool
    {
        return $this->isAdminOrSelf($user, $target);
    }

    public function delete(User $user): bool
    {
        return $user->isAdmin();
    }

    private function isAdminOrSelf(User $user, User $target): bool
    {
        // 認可条件を集約して可読性と保守性を向上させる
        return $user->isAdmin() || $user->id === $target->id;
    }
}
