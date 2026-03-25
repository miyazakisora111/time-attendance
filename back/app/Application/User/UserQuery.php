<?php

declare(strict_types=1);

namespace App\Application\User;

use App\Data\UserProfileData;
use App\Models\User;

/**
 * ユーザーのクエリ
 */
final class UserQuery
{
    /**
     * 認証済みユーザーのプロフィール情報を取得する
     * 
     * @param User $user 認証済みユーザー
     * @return UserProfileData ユーザープロフィールのデータ
     */
    public function getUserProfile(User $user): UserProfileData
    {
        // 必要なリレーションのみロード
        $user->loadMissing([
            'role:id,name',
            'userSetting',
        ]);

        return new UserProfileData(
            id: (string) $user->id,
            name: $user->name,
            email: $user->email,
            roles: $user->role !== null ? [$user->role->name] : [],
            settings: $user->userSetting?->toArray(),
            isAuthenticated: true,
        );
    }
}
