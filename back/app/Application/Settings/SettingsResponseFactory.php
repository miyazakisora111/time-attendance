<?php

declare(strict_types=1);

namespace App\Application\Settings;

use App\__Generated__\Enums\LanguageCode;
use App\__Generated__\Enums\ThemeType;
use App\__Generated__\Responses\Login\LoginHistoryResponse;
use App\__Generated__\Responses\Settings\SettingsNotifications;
use App\__Generated__\Responses\Settings\SettingsProfile;
use App\__Generated__\Responses\Settings\SettingsResponse;
use App\__Generated__\Responses\Settings\SettingsSecurity;
use App\Models\LoginHistory;
use App\Models\User;

/**
 * 設定レスポンスのファクトリ
 */
final class SettingsResponseFactory
{
    /**
     * ユーザーモデルから設定レスポンスを生成する
     *
     * @param User $user ユーザー
     * @return SettingsResponse 設定レスポンス
     */
    public function fromUser(User $user): SettingsResponse
    {
        return new SettingsResponse(
            profile: new SettingsProfile(
                name: $user->name,
                email: $user->email,
                department: $user->department?->name ?? '',
                role: $user->role?->name ?? '',
                employeeCode: $user->id,
            ),
            notifications: new SettingsNotifications(
                clockInReminder: $user->userNotificationSetting?->clock_in_reminder ?? false,
                leaveReminder: $user->userNotificationSetting?->leave_reminder ?? false,
            ),
            security: new SettingsSecurity(
                twoFactorEnabled: false,
                emailVerified: $user->email_verified_at !== null,
                lastLoginAt: $user->last_login_at?->toIso8601String(),
                passwordLastChangedAt: null,
            ),
            theme: $user->userSetting?->theme ?? ThemeType::LIGHT,
            language: $user->userSetting?->language ?? LanguageCode::JA,
        );
    }

    /**
     * ログイン履歴モデルからレスポンスを生成する
     *
     * @param LoginHistory $history ログイン履歴
     * @return LoginHistoryResponse ログイン履歴レスポンス
     */
    public function fromLoginHistory(LoginHistory $history): LoginHistoryResponse
    {
        return new LoginHistoryResponse(
            id: $history->id,
            ipAddress: $history->ip_address,
            userAgent: $history->user_agent,
            loggedInAt: $history->logged_in_at->toIso8601String(),
            loggedOutAt: $history->logged_out_at?->toIso8601String(),
        );
    }
}
