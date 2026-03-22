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
}
