<?php

declare(strict_types=1);

namespace App\Application;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;

/**
 * 認証済みユーザーを解決するクラス
 */
final class AuthUserProvider
{
    /**
     * 認証済みユーザーを必ず取得する。
     *
     * @return User 認証済みユーザー
     *
     * @throws AuthenticationException 未認証の場合
     */
    public function requireUser(): User
    {
        /** @var User|null $user */
        $user = auth()->user();

        if (! $user instanceof User) {
            throw new AuthenticationException('ログインしていません');
        }

        return $user;
    }
}
