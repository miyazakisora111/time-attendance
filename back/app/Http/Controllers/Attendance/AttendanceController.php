<?php

declare(strict_types=1);

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Attendance\AttendanceIndexRequest;
use App\Http\Requests\Attendance\AttendanceStoreRequest;
use App\Http\Requests\Attendance\AttendanceUpdateRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Attendance;
use App\Models\User;
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
     * 出勤打刻
     *
     * @return JsonResponse
     */
    public function clockIn(): JsonResponse
    {
        $result = $this->service->clockIn(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 退勤打刻
     *
     * @return JsonResponse
     */
    public function clockOut(): JsonResponse
    {
        $result = $this->service->clockOut(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 休憩開始
     *
     * @return JsonResponse
     */
    public function breakStart(): JsonResponse
    {
        $result = $this->service->breakStart(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 休憩終了
     *
     * @return JsonResponse
     */
    public function breakEnd(): JsonResponse
    {
        $result = $this->service->breakEnd(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 本日の勤怠情報を取得
     *
     * @return JsonResponse
     */
    public function today(): JsonResponse
    {
        $result = $this->service->getToday(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    /**
     * 勤怠一覧取得
     *
     * @param AttendanceIndexRequest $request
     * @return JsonResponse
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
     * 勤怠の新規登録
     *
     * @param AttendanceStoreRequest $request
     * @return JsonResponse
     */
    public function store(AttendanceStoreRequest $request): JsonResponse
    {
        $result = $this->service->store(
            user: $this->resolveUser(),
            input: $request->validated(),
        );

        return ApiResponse::success($result, status: 201);
    }

    /**
     * 勤怠の更新
     *
     * @param AttendanceUpdateRequest $request
     * @param Attendance $attendance
     * @return JsonResponse
     */
    public function update(AttendanceUpdateRequest $request, Attendance $attendanceId): JsonResponse
    {
        $result = $this->service->update(
            user: $this->resolveUser(),
            attendance: $attendanceId,
            input: $request->validated(),
        );

        return ApiResponse::success($result);
    }
}
