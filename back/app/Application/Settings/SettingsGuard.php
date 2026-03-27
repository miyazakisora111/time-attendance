<?php

declare(strict_types=1);

namespace App\Application\Settings;

use App\Exceptions\DomainException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * 設定のガード
 */
final class SettingsGuard
{
    /**
     * 現在のパスワードが正しいか検証する
     *
     * @param User $user ユーザー
     * @param string $currentPassword 現在のパスワード
     * @throws DomainException
     */
    public function assertCurrentPasswordMatches(User $user, string $currentPassword): void
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw new DomainException('現在のパスワードが正しくありません', 'INVALID_CURRENT_PASSWORD');
        }
    }

    /**
     * 新しいパスワードが現在のパスワードと異なるか検証する
     *
     * @param string $currentPassword 現在のパスワード
     * @param string $newPassword 新しいパスワード
     * @throws DomainException
     */
    public function assertNewPasswordDiffers(string $currentPassword, string $newPassword): void
    {
        if ($currentPassword === $newPassword) {
            throw new DomainException('新しいパスワードは現在のパスワードと異なる必要があります', 'SAME_PASSWORD');
        }
    }
}
