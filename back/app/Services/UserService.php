<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Auth\AuthenticationException;
use App\Models\User;

/**
 * 認証ユーザー取得を一元管理するサービス。
 *
 * プロジェクト内で認証済みユーザーを取得する唯一の窓口。
 * Controller / Service から auth() を直接呼ぶことを禁止し、
 * 本クラスを経由することでセキュリティと保守性を担保する。
 */
final class UserService extends BaseService
{
    /**
     * 認証済みユーザーを取得する。
     *
     * 未認証の場合は AuthenticationException をスローする。
     * フォールバックユーザーは一切返さない。
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
