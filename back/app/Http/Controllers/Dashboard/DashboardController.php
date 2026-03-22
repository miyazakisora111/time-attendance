<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Dashboard\DashboardClockRequest;
use App\Http\Responses\ApiResponse;
use App\Services\AttendanceService;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

/**
 * ダッシュボードのコントローラー
 */
final class DashboardController extends BaseController
{
    /**
     * コンストラクタ
     */
    public function __construct(
        private readonly DashboardService $service,
        private readonly AttendanceService $attendanceService,
    ) {}

    /**
     * ダッシュボード情報を取得する。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function show(): JsonResponse
    {
        $result = $this->service->getDashboard(
            user: $this->resolveUser(),
        );

        return ApiResponse::success($result);
    }

    /**
     * 打刻アクションを実行する。
     *
     * @param DashboardClockRequest $request 打刻リクエスト
     * @return JsonResponse Jsonレスポンス
     */
    public function clock(DashboardClockRequest $request): JsonResponse
    {
        $user = $this->resolveUser();
        $action = (string) $request->validated('action');

        $result = match ($action) {
            'in' => $this->attendanceService->clockIn($user),
            'out' => $this->attendanceService->clockOut($user),
            'break_start' => $this->attendanceService->breakStart($user),
            'break_end' => $this->attendanceService->breakEnd($user),
            default => throw new \App\Exceptions\DomainException('不正な打刻アクションです', 'INVALID_CLOCK_ACTION'),
        };

        $dashboard = $this->service->getDashboard($user);

        return ApiResponse::success($dashboard);
    }
}
