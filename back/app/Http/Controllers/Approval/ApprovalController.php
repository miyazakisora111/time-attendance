<?php

declare(strict_types=1);

namespace App\Http\Controllers\Approval;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Approval\CreateOvertimeRequestRequest;
use App\Http\Requests\Approval\CreatePaidLeaveRequestRequest;
use App\Http\Responses\ApiResponse;
use App\Services\ApprovalService;
use Illuminate\Http\JsonResponse;

/**
 * 申請・承認コントローラー。
 */
final class ApprovalController extends BaseController
{
    public function __construct(
        private readonly ApprovalService $service,
    ) {}

    /**
     * 申請一覧を返す。
     */
    public function index(): JsonResponse
    {
        $result = $this->service->getApprovalList(
            user: $this->resolveUser(),
        );

        return ApiResponse::success($result);
    }

    /**
     * 有給休暇を申請する。
     */
    public function createPaidLeave(CreatePaidLeaveRequestRequest $request): JsonResponse
    {
        $result = $this->service->createPaidLeaveRequest(
            user: $this->resolveUser(),
            input: $request->validated(),
        );

        return ApiResponse::success($result, '有給休暇を申請しました。', 201);
    }

    /**
     * 有給休暇申請を承認する。
     */
    public function approvePaidLeave(string $paidLeaveRequest): JsonResponse
    {
        $result = $this->service->approvePaidLeaveRequest(
            approver: $this->resolveUser(),
            requestId: $paidLeaveRequest,
        );

        return ApiResponse::success($result, '申請を承認しました。');
    }

    /**
     * 有給休暇申請を却下する。
     */
    public function rejectPaidLeave(string $paidLeaveRequest): JsonResponse
    {
        $result = $this->service->rejectPaidLeaveRequest(
            approver: $this->resolveUser(),
            requestId: $paidLeaveRequest,
        );

        return ApiResponse::success($result, '申請を却下しました。');
    }

    /**
     * 有給休暇申請をキャンセルする。
     */
    public function cancelPaidLeave(string $paidLeaveRequest): JsonResponse
    {
        $result = $this->service->cancelPaidLeaveRequest(
            user: $this->resolveUser(),
            requestId: $paidLeaveRequest,
        );

        return ApiResponse::success($result, '申請をキャンセルしました。');
    }

    /**
     * 残業を申請する。
     */
    public function createOvertime(CreateOvertimeRequestRequest $request): JsonResponse
    {
        $result = $this->service->createOvertimeRequest(
            user: $this->resolveUser(),
            input: $request->validated(),
        );

        return ApiResponse::success($result, '残業を申請しました。', 201);
    }

    /**
     * 残業申請を承認する。
     */
    public function approveOvertime(string $overtimeRequest): JsonResponse
    {
        $result = $this->service->approveOvertimeRequest(
            approver: $this->resolveUser(),
            requestId: $overtimeRequest,
        );

        return ApiResponse::success($result, '申請を承認しました。');
    }

    /**
     * 残業申請を差戻す。
     */
    public function returnOvertime(string $overtimeRequest): JsonResponse
    {
        $result = $this->service->returnOvertimeRequest(
            approver: $this->resolveUser(),
            requestId: $overtimeRequest,
        );

        return ApiResponse::success($result, '申請を差戻しました。');
    }

    /**
     * 残業申請をキャンセルする。
     */
    public function cancelOvertime(string $overtimeRequest): JsonResponse
    {
        $result = $this->service->cancelOvertimeRequest(
            user: $this->resolveUser(),
            requestId: $overtimeRequest,
        );

        return ApiResponse::success($result, '申請をキャンセルしました。');
    }
}
