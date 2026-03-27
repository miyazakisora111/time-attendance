<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Dashboard\DashboardClockRequest;
use App\Http\Responses\ApiResponse;
use App\Application\Dashboard\DashboardService;
use App\__Generated__\Enums\ClockAction;
use Illuminate\Http\JsonResponse;

/**
 * ダッシュボードのコントローラー
 */
final class DashboardController extends BaseController
{
    /**
     * コンストラクタ
     *
     * @param DashboardService $service ダッシュボードのサービス
     */
    public function __construct(
        private readonly DashboardService $service,
    ) {}

    /**
     * ダッシュボード情報を取得する。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function show(): JsonResponse
    {
        $result = $this->service->getDashboard(
            user: $this->resolveAuthUser(),
        );

        return ApiResponse::success($result);
    }

    /**
     * ダッシュボードから打刻を実行する。
     *
     * @param DashboardClockRequest $request HTTPリクエスト
     * @return JsonResponse JSONレスポンス
     */
    public function clock(DashboardClockRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // 打刻を実行する。
        $result = $this->service->clock(
            user: $this->resolveAuthUser(),
            action: ClockAction::from($validated['action']),
        );

        return ApiResponse::success($result);
    }
}
