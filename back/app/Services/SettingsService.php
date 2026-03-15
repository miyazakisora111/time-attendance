<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\UserSetting;

/**
 * 設定機能サービス。
 */
final class SettingsService extends BaseService
{
    /**
     * ログインユーザー設定を取得する。
     *
     * @return array{theme: string, language: string}
     */
    public function getSettings(): array
    {
        $user = $this->resolveUser();
        $user->loadMissing('userSetting');

        return [
            'theme' => $user->userSetting?->theme ?? 'light',
            'language' => $user->userSetting?->language ?? '日本語',
        ];
    }

    /**
     * ログインユーザー設定を更新する。
     *
     * @param array<string, mixed> $input
     * @return array{theme: string, language: string}
     */
    public function updateSettings(array $input): array
    {
        $user = $this->resolveUser();

        $setting = UserSetting::query()->firstOrNew([
            'user_id' => $user->id,
        ]);

        $setting->theme = (string) $input['theme'];
        $setting->language = (string) $input['language'];
        $setting->save();

        return [
            'theme' => $setting->theme,
            'language' => $setting->language,
        ];
    }

    /**
     * 認証ユーザーを解決する。
     */
    private function resolveUser(): User
    {
        /** @var User|null $authUser */
        $authUser = auth()->user();
        if ($authUser instanceof User) {
            return $authUser;
        }

        /** @var User $fallback */
        $fallback = User::query()->active()->ordered()->firstOrFail();

        return $fallback;
    }
}
