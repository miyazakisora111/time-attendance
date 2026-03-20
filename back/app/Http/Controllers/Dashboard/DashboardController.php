<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Dashboard\DashboardClockRequest;
use App\Http\Responses\ApiResponse;
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
     * @param DashboardService $service ダッシュボードのサービス
     */
    public function __construct(
        private readonly DashboardService $service,
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
     * 打刻アクション（出勤・退勤・休憩開始・休憩終了）を実行する。
     *
     * @param DashboardClockRequest $request 打刻リクエスト
     * @return JsonResponse Jsonレスポンス
     */
    public function clock(DashboardClockRequest $request): JsonResponse
    {
        $result = $this->service->clock(
            user: $this->resolveUser(),
            action: $request->action(),
        );

        return ApiResponse::success($result);
    }
}
