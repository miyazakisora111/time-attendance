<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\DomainException;
use App\Models\LoginHistory;
use App\Models\User;
use App\Models\UserNotificationSetting;
use App\Models\UserSetting;
use Illuminate\Support\Facades\Hash;

/**
 * 設定機能サービス。
 */
final class SettingsService extends BaseService
{
    /**
     * ログインユーザー設定を取得する。
     *
     * @param User $user 対象ユーザー
     * @return array<string, mixed>
     */
    public function getSettings(User $user): array
    {
        $user->loadMissing(['userSetting', 'userNotificationSetting', 'department', 'role']);

        $latestLogin = LoginHistory::query()
            ->user($user->id)
            ->latestLogin()
            ->first();

        return [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'department' => $user->department?->name ?? '未所属',
                'role' => $user->role?->name ?? 'メンバー',
                'employeeCode' => sprintf('EMP-%07d', max((int) ($user->sort_order ?? 0), 1)),
            ],
            'notifications' => [
                'clockInReminder' => $user->userNotificationSetting?->clock_in_reminder ?? true,
                'leaveReminder' => $user->userNotificationSetting?->leave_reminder ?? true,
            ],
            'security' => [
                'twoFactorEnabled' => false,
                'emailVerified' => $user->email_verified_at !== null,
                'lastLoginAt' => $latestLogin?->logged_in_at?->toIso8601String(),
                'passwordLastChangedAt' => null,
            ],
            'theme' => $user->userSetting?->theme ?? 'light',
            'language' => $user->userSetting?->language ?? 'ja',
        ];
    }

    /**
     * ログインユーザー設定を更新する。
     *
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    /**
     * ログインユーザー設定を更新する。
     *
     * @param User $user 対象ユーザー
     * @param array<string, mixed> $input バリデーション済み入力
     * @return array<string, mixed>
     */
    public function updateSettings(User $user, array $input): array
    {
        return $this->transaction(function () use ($user, $input): array {

            $user->fill([
                'name' => (string) data_get($input, 'profile.name', $user->name),
                'email' => (string) data_get($input, 'profile.email', $user->email),
            ]);
            $user->save();

            $setting = UserSetting::query()->firstOrNew([
                'user_id' => $user->id,
            ]);
            $setting->theme = (string) $input['theme'];
            $setting->language = (string) $input['language'];
            $setting->save();

            $notificationSetting = UserNotificationSetting::query()->firstOrNew([
                'user_id' => $user->id,
            ]);
            $notificationSetting->clock_in_reminder = (bool) data_get($input, 'notifications.clockInReminder', true);
            $notificationSetting->leave_reminder = (bool) data_get($input, 'notifications.leaveReminder', true);
            $notificationSetting->save();

            return $this->getSettings($user);
        });
    }

    /**
     * パスワードを変更する。
     *
     * @param User $user 対象ユーザー
     * @param array<string, mixed> $input バリデーション済み入力
     * @return array<string, mixed>
     */
    public function changePassword(User $user, array $input): array
    {
        if (!Hash::check((string) $input['currentPassword'], $user->password)) {
            throw new DomainException('現在のパスワードが正しくありません。', 'INVALID_CURRENT_PASSWORD');
        }

        $user->password = (string) $input['newPassword'];
        $user->save();

        $this->log('パスワード変更', ['user_id' => $user->id]);

        return $this->getSettings($user);
    }

    /**
     * ログイン履歴一覧を取得する。
     *
     * @param User $user 対象ユーザー
     * @return array<int, array<string, mixed>>
     */
    public function getLoginHistories(User $user): array
    {
        return LoginHistory::query()
            ->user($user->id)
            ->orderByDesc('logged_in_at')
            ->limit(20)
            ->get()
            ->map(fn(LoginHistory $h) => [
                'id' => $h->id,
                'ipAddress' => $h->ip_address,
                'userAgent' => $h->user_agent,
                'loggedInAt' => $h->logged_in_at?->toIso8601String(),
                'loggedOutAt' => $h->logged_out_at?->toIso8601String(),
            ])
            ->all();
    }
}
