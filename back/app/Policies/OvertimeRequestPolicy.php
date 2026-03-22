<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\OvertimeRequest;
use App\Models\User;

/**
 * 残業申請の認可ポリシー。
 */
class OvertimeRequestPolicy
{
    /**
     * 承認: 承認権限を持ち、自分の申請でないこと。
     */
    public function approve(User $user, OvertimeRequest $request): bool
    {
        return $user->isApprover() && $user->id !== $request->user_id;
    }

    /**
     * 差戻し: 承認と同一条件。
     */
    public function returnRequest(User $user, OvertimeRequest $request): bool
    {
        return $this->approve($user, $request);
    }

    /**
     * キャンセル: 申請者本人のみ。
     */
    public function cancel(User $user, OvertimeRequest $request): bool
    {
        return $user->id === $request->user_id;
    }
}
