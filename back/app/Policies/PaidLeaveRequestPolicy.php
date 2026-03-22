<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\PaidLeaveRequest;
use App\Models\User;

/**
 * 有給休暇申請の認可ポリシー。
 */
class PaidLeaveRequestPolicy
{
    /**
     * 承認: 承認権限を持ち、自分の申請でないこと。
     */
    public function approve(User $user, PaidLeaveRequest $request): bool
    {
        return $user->isApprover() && $user->id !== $request->user_id;
    }

    /**
     * 却下: 承認と同一条件。
     */
    public function reject(User $user, PaidLeaveRequest $request): bool
    {
        return $this->approve($user, $request);
    }

    /**
     * キャンセル: 申請者本人のみ。
     */
    public function cancel(User $user, PaidLeaveRequest $request): bool
    {
        return $user->id === $request->user_id;
    }
}
