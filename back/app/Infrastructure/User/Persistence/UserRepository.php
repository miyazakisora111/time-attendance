<?php

declare(strict_types=1);

namespace App\Infrastructure\User\Persistence;

use App\Data\LoginHistoryData;
use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * ユーザーのリポジトリ
 */
final class UserRepository
{
    /**
     * 最終ログイン日時を更新する
     *
     * @param User $user
     */
    public function updateLastLoginAt(User $user): void
    {
        $user->update([
            'last_login_at' => now(),
        ]);
    }

    /**
     * ログイン履歴を記録する
     *
     * @param User $user
     * @param LoginHistoryData $data
     * @return LoginHistory
     */
    public function createLoginHistory(User $user, LoginHistoryData $data): LoginHistory
    {
        return LoginHistory::query()->create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'ip_address' => $data->ipAddress,
            'user_agent' => $data->userAgent,
            'logged_in_at' => $data->loggedInAt,
        ]);
    }

    /**
     * 最新のログイン履歴にログアウト日時を記録する
     *
     * @param User $user
     */
    public function closeLatestLoginHistory(User $user): void
    {
        LoginHistory::query()
            ->user($user->id)
            ->active()
            ->latestLogin()
            ->first()
            ?->update(['logged_out_at' => now()]);
    }
}
