<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

/**
 * UserPolicy
 * 
 * ユーザー操作の認可を管理するポリシークラス。
 * Laravelの認可システムと統合します。
 */
class UserPolicy
{
    /**
     * ユーザーがすべてのユーザーを表示できるかを判定
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * ユーザーが特定のユーザーを表示できるかを判定
     */
    public function view(?User $user, User $model): bool
    {
        return $user?->id === $model->id || $user?->isAdmin();
    }

    /**
     * ユーザーがユーザーを作成できるかを判定
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * ユーザーが特定のユーザーを更新できるかを判定
     */
    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->isAdmin();
    }

    /**
     * ユーザーが特定のユーザーを削除できるかを判定
     */
    public function delete(User $user, User $model): bool
    {
        return $user->id !== $model->id && $user->isAdmin();
    }

    /**
     * ユーザーがユーザーを復元できるかを判定
     */
    public function restore(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    /**
     * ユーザーがユーザーを完全削除できるかを判定
     */
    public function forceDelete(User $user, User $model): bool
    {
        return $user->id !== $model->id && $user->isAdmin();
    }
}
