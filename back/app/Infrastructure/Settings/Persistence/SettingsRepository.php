<?php

declare(strict_types=1);

namespace App\Infrastructure\Settings\Persistence;

use App\Models\User;

/**
 * 設定のリポジトリ
 */
final class SettingsRepository
{
    /**
     * プロフィールを更新する
     *
     * @param User $user
     * @param array<string, mixed> $attributes
     */
    public function updateProfile(User $user, array $attributes): void
    {
        $user->update($attributes);
    }

    /**
     * ユーザー設定を更新する
     *
     * @param User $user
     * @param array<string, mixed> $attributes
     */
    public function updateUserSetting(User $user, array $attributes): void
    {
        $user->userSetting()->updateOrCreate(
            ['user_id' => $user->id],
            $attributes,
        );
    }

    /**
     * 通知設定を更新する
     *
     * @param User $user
     * @param array<string, mixed> $attributes
     */
    public function updateNotificationSetting(User $user, array $attributes): void
    {
        $user->userNotificationSetting()->updateOrCreate(
            ['user_id' => $user->id],
            $attributes,
        );
    }

    /**
     * パスワードを更新する
     *
     * @param User $user
     * @param string $password
     */
    public function updatePassword(User $user, string $password): void
    {
        $user->update([
            'password' => $password,
        ]);
    }
}
