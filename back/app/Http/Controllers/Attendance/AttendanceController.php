<?php

declare(strict_types=1);

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Attendance\AttendanceIndexRequest;
use App\Http\Requests\Attendance\AttendanceStoreRequest;
use App\Http\Requests\Attendance\AttendanceUpdateRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Attendance;
use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;

/**
 * 勤怠管理のコントローラー
 */
final class AttendanceController extends BaseController
{
    /**
     * コンストラクタ
     *
     * @param AttendanceService $service 勤怠のサービス
     */
    public function __construct(
        private readonly AttendanceService $service,
    ) {}

    /**
     * 出勤打刻する。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function clockIn(): JsonResponse
    {
        $result = $this->service->clockIn(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 退勤打刻する。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function clockOut(): JsonResponse
    {
        $result = $this->service->clockOut(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 休憩開始する。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function breakStart(): JsonResponse
    {
        $result = $this->service->breakStart(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 休憩終了する。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function breakEnd(): JsonResponse
    {
        $result = $this->service->breakEnd(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 本日の勤怠情報を取得する。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function today(): JsonResponse
    {
        $result = $this->service->getToday(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 勤怠一覧を取得する。
     *
     * @param AttendanceIndexRequest $request リクエスト
     * @return JsonResponse Jsonレスポンス
     */
    public function index(AttendanceIndexRequest $request): JsonResponse
    {
        $result = $this->service->index(
            user: $this->resolveUser(),
            from: (string) $request->input('from'),
            to: (string) $request->input('to'),
        );

        return ApiResponse::success($result);
    }

    /**
     * 勤怠を新規登録する。
     *
     * @param AttendanceStoreRequest $request リクエスト
     * @return JsonResponse Jsonレスポンス
     */
    public function store(AttendanceStoreRequest $request): JsonResponse
    {
        // TODO:勤怠修正機能の作成。
        $result = $this->service->store(
            user: $this->resolveUser(),
            input: $request->validated(),
        );

        return ApiResponse::success($result, status: 201);
    }

    /**
     * 勤怠を更新する。
     *
     * @param AttendanceUpdateRequest $request リクエスト
     * @param Attendance $attendance 更新対象の勤怠
     * @return JsonResponse Jsonレスポンス
     */
    public function update(AttendanceUpdateRequest $request, Attendance $attendance): JsonResponse
    {
        // TODO:勤怠修正機能の作成。
        $result = $this->service->update(
            user: $this->resolveUser(),
            attendance: $attendance,
            input: $request->validated(),
        );

        return ApiResponse::success($result);
    }
}
