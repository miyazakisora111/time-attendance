<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Auth\AuthenticationException;
use App\Models\User;

/**
 * ユーザーのサービス
 */
final class UserService extends BaseService
{
    /**
     * 認証済みユーザーを取得する。
     *
     * @return User 認証済みユーザー
     *
     * @throws AuthenticationException 未認証の場合
     */
    public function getAuthUser(): User
    {
        /** @var User|null $user */
        $user = auth()->user();

        if (!$user instanceof User) {
            throw new AuthenticationException('ログインしていません');
        }

        return $user;
    }
}
