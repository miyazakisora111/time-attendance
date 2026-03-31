<?php

declare(strict_types=1);

namespace App\Http\Controllers\Attendance;

use App\Application\Attendance\AttendanceResolver;
use App\Application\Attendance\AttendanceService;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Attendance\AttendanceClockRequest;
use App\Http\Requests\Attendance\AttendanceStoreRequest;
use App\Http\Requests\Attendance\AttendanceUpdateRequest;
use App\Http\Responses\ApiResponse;
use App\Http\Responses\Factories\AttendanceResponseFactory;
use App\Infrastructure\Attendance\Query\AttendanceQuery;
use App\Models\Attendance;
use App\__Generated__\Enums\ClockAction;
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
     * @param AttendanceQuery $query 勤怠のクエリ
     * @param AttendanceResolver $resolver 勤怠のリゾルバ
     * @param AttendanceResponseFactory $factory 勤怠データのファクトリ
     */
    public function __construct(
        private readonly AttendanceService $service,
        private readonly AttendanceQuery $query,
        private readonly AttendanceResolver $resolver,
        private readonly AttendanceResponseFactory $factory,
    ) {}

    /**
     * 打刻を実行する。
     *
     * @param AttendanceClockRequest $request HTTPリクエスト
     * @return JsonResponse JSONレスポンス
     */
    public function clock(AttendanceClockRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $action = ClockAction::from($validated['action']);

        $user = $this->resolveAuthUser();
        $attendance = $this->service->clock(
            user: $user,
            action: $action,
        );
        $readModel = $this->query->getDetail($user);
        $clockStatus = $this->resolver->resolveClockStatus($attendance);

        return ApiResponse::success(
            $this->factory->create($readModel, $clockStatus),
        );
    }

    /**
     * 最新の勤怠情報を取得する。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function latest(): JsonResponse
    {
        $user = $this->resolveAuthUser();
        $attendance = $this->service->getLatestAttendance(user: $user);
        $readModel = $attendance ? $this->query->getDetail($user) : null;
        $clockStatus = $this->resolver->resolveClockStatus($attendance);

        return ApiResponse::success($this->factory->create($readModel, $clockStatus));
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
        $user = $this->resolveAuthUser();
        $attendance = $this->service->store(
            user: $user,
            input: $request->validated(),
        );
        $readModel = $this->query->getDetail($user);
        $clockStatus = $this->resolver->resolveClockStatus($attendance);

        return ApiResponse::success($this->factory->create($readModel, $clockStatus), status: 201);
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
        $readModel = $this->query->getDetail($this->resolveAuthUser());
        $clockStatus = $this->resolver->resolveClockStatus($attendance);

        return ApiResponse::success($this->factory->create($readModel, $clockStatus));
    }
}
