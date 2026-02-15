<?php

declare(strict_types=1);

namespace App\Http\Controllers\DashBoard;

use App\Http\Controllers\BaseController;
use App\Http\Requests\DashBoard\CalendarIndexRequest;
use App\Http\Responses\ApiResponse;
use App\Services\CalendarService;
use Illuminate\Http\JsonResponse;

/**
 * カレンダーのコントローラー
 */
class CalendarController extends BaseController
{
    /**
     * コンストラクタ
     * 
     * @param CalendarService $service カレンダーのサービス
     */
    public function __construct(
        private readonly CalendarService $service,
    ) {}

    /**
     * 指定された年月のカレンダーを取得する。
     *
     * @param CalendarIndexRequest $request リクエスト
     * @return JsonResponse Jsonレスポンス
     */
    public function index(CalendarIndexRequest $request): JsonResponse
    {
        // 日付を取得する。
        $result = $this->service->getDates(
            year: $request->year(),
            month: $request->month(),
        );

        return ApiResponse::success($result);
    }
}
