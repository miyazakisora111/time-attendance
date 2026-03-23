<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\DomainException;
use App\Models\OvertimeRequest;
use App\Models\PaidLeaveGrant;
use App\Models\PaidLeaveRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

/**
 * 申請・承認サービス。
 */
final class ApprovalService extends BaseService
{
    // ────────────────────────────────────────────
    // 一覧取得
    // ────────────────────────────────────────────

    /**
     * 自分の申請一覧を取得する。
     */
    public function getApprovalList(User $user): array
    {
        $paidLeaveRequests = PaidLeaveRequest::query()
            ->user($user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn(PaidLeaveRequest $r) => $this->formatPaidLeaveRequest($r))
            ->all();

        $overtimeRequests = OvertimeRequest::query()
            ->user($user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn(OvertimeRequest $r) => $this->formatOvertimeRequest($r))
            ->all();

        // 承認権限を持つ場合、他ユーザーの pending 申請も取得
        $pendingPaidLeaves = [];
        $pendingOvertimes = [];

        if ($user->isApprover()) {
            $pendingPaidLeaves = PaidLeaveRequest::query()
                ->where('user_id', '!=', $user->id)
                ->pending()
                ->orderByDesc('created_at')
                ->get()
                ->map(fn(PaidLeaveRequest $r) => $this->formatPaidLeaveRequest($r))
                ->all();

            $pendingOvertimes = OvertimeRequest::query()
                ->where('user_id', '!=', $user->id)
                ->pending()
                ->orderByDesc('created_at')
                ->get()
                ->map(fn(OvertimeRequest $r) => $this->formatOvertimeRequest($r))
                ->all();
        }

        return [
            'paidLeaveRequests' => $paidLeaveRequests,
            'overtimeRequests' => $overtimeRequests,
            'pendingPaidLeaveRequests' => $pendingPaidLeaves,
            'pendingOvertimeRequests' => $pendingOvertimes,
            'paidLeaveSummary' => $this->getPaidLeaveSummary($user),
            'isApprover' => $user->isApprover(),
        ];
    }

    // ────────────────────────────────────────────
    // 有給休暇
    // ────────────────────────────────────────────

    /**
     * 有給休暇を申請する。
     */
    public function createPaidLeaveRequest(User $user, array $input): array
    {
        return $this->transaction(function () use ($user, $input): array {
            $existing = PaidLeaveRequest::query()
                ->user($user->id)
                ->date($input['leaveDate'])
                ->whereIn('status', [PaidLeaveRequest::STATUS_PENDING, PaidLeaveRequest::STATUS_APPROVED])
                ->exists();

            if ($existing) {
                throw new DomainException('指定日に既に申請が存在します。', 'DUPLICATE_LEAVE_REQUEST');
            }

            $summary = $this->getPaidLeaveSummary($user);
            $days = (float) $input['days'];

            if ($summary['remainingDays'] < $days) {
                throw new DomainException('有給残日数が不足しています。', 'INSUFFICIENT_LEAVE_DAYS');
            }

            $request = new PaidLeaveRequest();
            $request->id = Str::uuid()->toString();
            $request->user_id = $user->id;
            $request->leave_date = $input['leaveDate'];
            $request->days = $days;
            $request->status = PaidLeaveRequest::STATUS_PENDING;
            $request->reason = $input['reason'] ?? null;
            $request->save();

            $this->log('有給休暇申請作成', ['user_id' => $user->id, 'request_id' => $request->id]);

            return $this->formatPaidLeaveRequest($request);
        });
    }

    /**
     * 有給休暇申請を承認する。
     */
    public function approvePaidLeaveRequest(User $approver, string $requestId): array
    {
        return $this->transaction(function () use ($approver, $requestId): array {
            $request = PaidLeaveRequest::query()->findOrFail($requestId);

            Gate::forUser($approver)->authorize('approve', $request);

            if (!$request->isPending()) {
                throw new DomainException('申請中の申請のみ承認できます。', 'INVALID_STATUS');
            }

            $request->status = PaidLeaveRequest::STATUS_APPROVED;
            $request->approved_by = $approver->id;
            $request->approved_at = Carbon::now();
            $request->save();

            $this->log('有給休暇申請承認', [
                'request_id' => $requestId,
                'approver_id' => $approver->id,
            ]);

            return $this->formatPaidLeaveRequest($request);
        });
    }

    /**
     * 有給休暇申請を却下する。
     */
    public function rejectPaidLeaveRequest(User $approver, string $requestId): array
    {
        return $this->transaction(function () use ($approver, $requestId): array {
            $request = PaidLeaveRequest::query()->findOrFail($requestId);

            Gate::forUser($approver)->authorize('reject', $request);

            if (!$request->isPending()) {
                throw new DomainException('申請中の申請のみ却下できます。', 'INVALID_STATUS');
            }

            $request->status = PaidLeaveRequest::STATUS_REJECTED;
            $request->approved_by = $approver->id;
            $request->approved_at = Carbon::now();
            $request->save();

            $this->log('有給休暇申請却下', [
                'request_id' => $requestId,
                'approver_id' => $approver->id,
            ]);

            return $this->formatPaidLeaveRequest($request);
        });
    }

    /**
     * 有給休暇申請をキャンセルする。
     */
    public function cancelPaidLeaveRequest(User $user, string $requestId): array
    {
        return $this->transaction(function () use ($user, $requestId): array {
            $request = PaidLeaveRequest::query()->findOrFail($requestId);

            Gate::forUser($user)->authorize('cancel', $request);

            if (!$request->isPending()) {
                throw new DomainException('申請中の申請のみキャンセルできます。', 'INVALID_STATUS');
            }

            $request->status = PaidLeaveRequest::STATUS_CANCELED;
            $request->save();

            $this->log('有給休暇申請キャンセル', [
                'request_id' => $requestId,
                'user_id' => $user->id,
            ]);

            return $this->formatPaidLeaveRequest($request);
        });
    }

    // ────────────────────────────────────────────
    // 残業
    // ────────────────────────────────────────────

    /**
     * 残業を申請する。
     */
    public function createOvertimeRequest(User $user, array $input): array
    {
        return $this->transaction(function () use ($user, $input): array {
            $request = new OvertimeRequest();
            $request->id = Str::uuid()->toString();
            $request->user_id = $user->id;
            $request->work_date = $input['workDate'];
            $request->start_time = $input['startTime'];
            $request->end_time = $input['endTime'];
            $request->status = OvertimeRequest::STATUS_PENDING;
            $request->reason = $input['reason'] ?? null;
            $request->save();

            $this->log('残業申請作成', ['user_id' => $user->id, 'request_id' => $request->id]);

            return $this->formatOvertimeRequest($request);
        });
    }

    /**
     * 残業申請を承認する。
     */
    public function approveOvertimeRequest(User $approver, string $requestId): array
    {
        return $this->transaction(function () use ($approver, $requestId): array {
            $request = OvertimeRequest::query()->findOrFail($requestId);

            Gate::forUser($approver)->authorize('approve', $request);

            if (!$request->isPending()) {
                throw new DomainException('申請中の申請のみ承認できます。', 'INVALID_STATUS');
            }

            $request->status = OvertimeRequest::STATUS_APPROVED;
            $request->approved_by = $approver->id;
            $request->approved_at = Carbon::now();
            $request->save();

            $this->log('残業申請承認', [
                'request_id' => $requestId,
                'approver_id' => $approver->id,
            ]);

            return $this->formatOvertimeRequest($request);
        });
    }

    /**
     * 残業申請を差戻す。
     */
    public function returnOvertimeRequest(User $approver, string $requestId): array
    {
        return $this->transaction(function () use ($approver, $requestId): array {
            $request = OvertimeRequest::query()->findOrFail($requestId);

            Gate::forUser($approver)->authorize('returnRequest', $request);

            if (!$request->isPending()) {
                throw new DomainException('申請中の申請のみ差戻しできます。', 'INVALID_STATUS');
            }

            $request->status = OvertimeRequest::STATUS_RETURNED;
            $request->approved_by = $approver->id;
            $request->approved_at = Carbon::now();
            $request->save();

            $this->log('残業申請差戻し', [
                'request_id' => $requestId,
                'approver_id' => $approver->id,
            ]);

            return $this->formatOvertimeRequest($request);
        });
    }

    /**
     * 残業申請をキャンセルする。
     */
    public function cancelOvertimeRequest(User $user, string $requestId): array
    {
        return $this->transaction(function () use ($user, $requestId): array {
            $request = OvertimeRequest::query()->findOrFail($requestId);

            Gate::forUser($user)->authorize('cancel', $request);

            if (!$request->isPending()) {
                throw new DomainException('申請中の申請のみキャンセルできます。', 'INVALID_STATUS');
            }

            $request->status = OvertimeRequest::STATUS_CANCELED;
            $request->save();

            $this->log('残業申請キャンセル', [
                'request_id' => $requestId,
                'user_id' => $user->id,
            ]);

            return $this->formatOvertimeRequest($request);
        });
    }

    // ────────────────────────────────────────────
    // プライベート
    // ────────────────────────────────────────────

    /**
     * 有給残日数サマリーを取得する。
     */
    private function getPaidLeaveSummary(User $user): array
    {
        $totalDays = PaidLeaveGrant::query()
            ->user($user->id)
            ->active()
            ->sum('days');

        $usedDays = PaidLeaveRequest::query()
            ->user($user->id)
            ->approved()
            ->sum('days');

        return [
            'totalDays' => (float) $totalDays,
            'usedDays' => (float) $usedDays,
            'remainingDays' => (float) $totalDays - (float) $usedDays,
        ];
    }

    /**
     * 有給休暇申請をレスポンス形式にフォーマットする。
     */
    private function formatPaidLeaveRequest(PaidLeaveRequest $request): array
    {
        return [
            'id' => $request->id,
            'userId' => $request->user_id,
            'leaveDate' => $request->leave_date->format('Y-m-d'),
            'days' => $request->days,
            'status' => $request->status,
            'reason' => $request->reason,
            'approvedBy' => $request->approved_by,
            'approvedAt' => $request->approved_at?->toIso8601String(),
            'createdAt' => $request->created_at->toIso8601String(),
        ];
    }

    /**
     * 残業申請をレスポンス形式にフォーマットする。
     */
    private function formatOvertimeRequest(OvertimeRequest $request): array
    {
        return [
            'id' => $request->id,
            'userId' => $request->user_id,
            'workDate' => $request->work_date->format('Y-m-d'),
            'startTime' => $request->start_time->toIso8601String(),
            'endTime' => $request->end_time->toIso8601String(),
            'status' => $request->status,
            'reason' => $request->reason,
            'durationHours' => $request->getDurationHours(),
            'approvedBy' => $request->approved_by,
            'approvedAt' => $request->approved_at?->toIso8601String(),
            'createdAt' => $request->created_at->toIso8601String(),
        ];
    }
}
