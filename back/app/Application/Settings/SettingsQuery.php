<?php

declare(strict_types=1);

namespace App\Application\Settings;

use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * 設定のクエリ
 */
final class SettingsQuery
{
    /**
     * ユーザーのログイン履歴を取得する
     *
     * @param User $user ユーザー
     * @param int $limit 取得件数
     * @return Collection<int, LoginHistory> ログイン履歴
     */
    public function getLoginHistories(User $user, int $limit = 20): Collection
    {
        return LoginHistory::query()
            ->user($user->id)
            ->latestLogin()
            ->limit($limit)
            ->get();
    }
}
