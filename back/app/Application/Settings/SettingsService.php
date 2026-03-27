<?php

declare(strict_types=1);

namespace App\Application\Settings;

use App\Application\BaseService;
use App\__Generated__\Responses\Settings\SettingsResponse;
use App\Models\User;

/**
 * 設定のサービス
 */
final class SettingsService extends BaseService
{
    /**
     * コンストラクタ
     *
     * @param SettingsQuery $query 設定のクエリ
     * @param SettingsGuard $guard 設定のガード
     * @param SettingsResponseFactory $factory 設定レスポンスファクトリ
     */
    public function __construct(
        private readonly SettingsQuery $query,
        private readonly SettingsGuard $guard,
        private readonly SettingsResponseFactory $factory,
    ) {}

    /**
     * ユーザーの設定情報を取得する
     *
     * @param User $user ユーザー
     * @return SettingsResponse 設定レスポンス
     */
    public function getSettings(User $user): SettingsResponse
    {
        $user->loadMissing([
            'role:id,name',
            'department:id,name',
            'userSetting',
            'userNotificationSetting',
        ]);

        return $this->factory->fromUser($user);
    }

    /**
     * ユーザーの設定を更新する
     *
     * @param User $user ユーザー
     * @param array<string, mixed> $input 入力値
     * @return SettingsResponse 設定レスポンス
     */
    public function updateSettings(User $user, array $input): SettingsResponse
    {
        return $this->transaction(function () use ($user, $input): SettingsResponse {

            // プロフィール情報を更新する。
            $user->update([
                'name' => $input['profile']['name'],
                'email' => $input['profile']['email'],
            ]);

            // テーマ・言語の設定を更新する。
            $user->userSetting()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'theme' => $input['theme'],
                    'language' => $input['language'],
                ],
            );

            // 通知設定を更新する。
            $user->userNotificationSetting()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'clock_in_reminder' => $input['notifications']['clockInReminder'],
                    'leave_reminder' => $input['notifications']['leaveReminder'],
                ],
            );

            // リレーションを再読込して最新状態を返す。
            $user->load([
                'role:id,name',
                'department:id,name',
                'userSetting',
                'userNotificationSetting',
            ]);

            return $this->factory->fromUser($user);
        });
    }

    /**
     * パスワードを変更する
     *
     * @param User $user ユーザー
     * @param array<string, mixed> $input 入力値
     * @return array<string, string> 結果メッセージ
     */
    public function changePassword(User $user, array $input): array
    {
        return $this->transaction(function () use ($user, $input): array {

            // 現在のパスワードを検証する。
            $this->guard->assertCurrentPasswordMatches($user, $input['currentPassword']);

            // 新しいパスワードが現在と異なることを検証する。
            $this->guard->assertNewPasswordDiffers($input['currentPassword'], $input['newPassword']);

            // パスワードを更新する。
            $user->update([
                'password' => $input['newPassword'],
            ]);

            return ['message' => 'パスワードを変更しました'];
        });
    }

    /**
     * ユーザーのログイン履歴を取得する
     *
     * @param User $user ユーザー
     * @return array<int, mixed> ログイン履歴一覧
     */
    public function getLoginHistories(User $user): array
    {
        $histories = $this->query->getLoginHistories($user);

        return $histories
            ->map(fn($history) => $this->factory->fromLoginHistory($history))
            ->all();
    }
}
