<?php

declare(strict_types=1);

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Attendance\AttendanceIndexRequest;
use App\Http\Requests\Attendance\AttendanceStoreRequest;
use App\Http\Requests\Attendance\AttendanceUpdateRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Attendance;
use App\Application\Attendance\AttendanceService;
use App\Http\Responses\Factories\AttendanceResponseFactory;
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
     * @param AttendanceResponseFactory $factory 勤怠データのファクトリ
     */
    public function __construct(
        private readonly AttendanceService $service,
        private readonly AttendanceResponseFactory $factory,
    ) {}

    /**
     * 出勤打刻する。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function clockIn(): JsonResponse
    {
        $attendance = $this->service->clockIn(user: $this->resolveAuthUser());
        $result = $this->factory->create($attendance);
        return ApiResponse::success($result);
    }

    /**
     * 退勤打刻する。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function clockOut(): JsonResponse
    {
        $attendance = $this->service->clockOut(user: $this->resolveAuthUser());
        $result = $this->factory->create($attendance);
        return ApiResponse::success($result);
    }

    /**
     * 休憩開始する。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function breakStart(): JsonResponse
    {
        $attendance = $this->service->breakStart(user: $this->resolveAuthUser());
        $result = $this->factory->create($attendance);
        return ApiResponse::success($result);
    }

    /**
     * 休憩終了する。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function breakEnd(): JsonResponse
    {
        $attendance = $this->service->breakEnd(user: $this->resolveAuthUser());
        $result = $this->factory->create($attendance);
        return ApiResponse::success($result);
    }

    /**
     * 最新の勤怠情報を取得する。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function latest(): JsonResponse
    {
        $attendance = $this->service->getLatestAttendance(user: $this->resolveAuthUser());
        $result = $this->factory->create($attendance);
        return ApiResponse::success($result);
    }

    /**
     * 勤怠を新規登録する。
     *
     * @param AttendanceStoreRequest $request HTTPリクエスト
     * @return JsonResponse JSONレスポンス
     */
    public function store(AttendanceStoreRequest $request): JsonResponse
    {
        // TODO:勤怠修正機能の作成。
        $attendance = $this->service->store(
            user: $this->resolveAuthUser(),
            input: $request->validated(),
        );
        $result = $this->factory->create($attendance);

        return ApiResponse::success($result, status: 201);
    }

    /**
     * 勤怠を更新する。
     *
     * @param AttendanceUpdateRequest $request HTTPリクエスト
     * @param Attendance $attendance 更新対象の勤怠
     * @return JsonResponse JSONレスポンス
     */
    public function update(AttendanceUpdateRequest $request, Attendance $attendance): JsonResponse
    {
        // TODO:勤怠修正機能の作成。
        $attendance = $this->service->update(
            attendance: $attendance,
            input: $request->validated(),
        );
        $result = $this->factory->create($attendance);

        return ApiResponse::success($result);
    }
}
