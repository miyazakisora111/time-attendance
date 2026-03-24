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
     * 
     * @param DashboardService $dashboardService ダッシュボードのサービス
     * @param AttendanceService $attendanceService 勤怠のサービス
     */
    public function __construct(
        private readonly DashboardService $dashboardService,
        private readonly AttendanceService $attendanceService,
    ) {}

    /**
     * ダッシュボード情報を取得する。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function show(): JsonResponse
    {
        // ダッシュボード情報を取得する。
        $user = $this->resolveAuthUser();
        $result = $this->dashboardService->getDashboard(user: $user);

        return ApiResponse::success($result);
    }

    /**
     * 打刻アクションを実行する。
     *
     * @param DashboardClockRequest $request 打刻HTTPリクエスト
     * @return JsonResponse JSONレスポンス
     */
    public function clock(DashboardClockRequest $request): JsonResponse
    {
        // TODO:APIをin,out,breakStart,breakEndの4つに分ける
        $user = $this->resolveAuthUser();
        $action = (string) $request->validated('action');

        $result = match ($action) {
            'in' => $this->attendanceService->clockIn($user),
            'out' => $this->attendanceService->clockOut($user),
            'breakStart' => $this->attendanceService->breakStart($user),
            'breakEnd' => $this->attendanceService->breakEnd($user),
            default => throw new \App\Exceptions\DomainException('不正な打刻アクションです', 'INVALID_CLOCK_ACTION'),
        };

        $dashboard = $this->dashboardService->getDashboard($user);

        return ApiResponse::success($dashboard);
    }
}
