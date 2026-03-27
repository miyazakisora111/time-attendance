<?php

declare(strict_types=1);

namespace App\Http\Responses\Factories;

use App\__Generated__\Responses\User\UserResponse;
use App\__Generated__\Responses\User\Settings;
use App\Models\User;

/**
 * ユーザーレスポンスを生成する
 */
class UserResponseFactory
{
    /**
     * ユーザーレスポンスを作成する。
     * 
     * @param User $user ユーザー
     * @return UserResponse ユーザーレスポンス
     */
    public function fromUser(User $user): UserResponse
    {
        // 必要なリレーションのみロード
        $user->loadMissing([
            'role:id,name',
            'userSetting',
        ]);

        return new UserResponse(
            id: (string) $user->id,
            name: $user->name,
            email: $user->email,
            roles: $user->role !== null ? [$user->role->name] : [],
            settings: $this->buildSettings($user),
        );
    }

    /**
     * ユーザー設定レスポンスを生成する。
     */
    private function buildSettings(User $user): ?Settings
    {
        if ($user->userSetting === null) {
            return null;
        }

        return new Settings(
            theme: $user->userSetting->theme,
            language: $user->userSetting->language,
        );
    }
}
