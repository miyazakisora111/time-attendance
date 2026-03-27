<?php

declare(strict_types=1);

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Attendance\CalendarIndexRequest;
use App\Http\Responses\ApiResponse;
use App\Application\Schedule\ScheduleService;
use Illuminate\Http\JsonResponse;

/**
 * カレンダーのコントローラー
 */
final class CalendarController extends BaseController
{
    /**
     * コンストラクタ
     *
     * @param ScheduleService $service スケジュールのサービス
     */
    public function __construct(
        private readonly ScheduleService $service,
    ) {}

    /**
     * 指定された年月のカレンダーを取得する。
     *
     * @param CalendarIndexRequest $request HTTPリクエスト
     * @return JsonResponse JSONレスポンス
     */
    public function index(CalendarIndexRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // カレンダーを取得する。
        $result = $this->service->getCalendar(
            user: $this->resolveAuthUser(),
            year: $validated['year'],
            month: $validated['month'],
        );

        return ApiResponse::success($result);
    }
}
