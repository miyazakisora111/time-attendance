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

class AttendanceController extends BaseController
{
    public function __construct(
        private AttendanceService $service
    ) {}

    public function clockIn()
    {
        $result = $this->service->clockIn(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    public function clockOut()
    {
        $result = $this->service->clockOut(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    public function today()
    {
        $result = $this->service->getToday(user: $this->resolveUser());
        return ApiResponse::success($result);
    }

    public function index(AttendanceIndexRequest $request)
    {
        $result = $this->service->index(
            user: $this->resolveUser(),
            from: (string) $request->input('from'),
            to: (string) $request->input('to'),
        );

        return ApiResponse::success($result);
    }

    public function store(AttendanceStoreRequest $request)
    {
        $result = $this->service->store(
            user: $this->resolveUser(),
            input: $request->validated(),
        );

        return ApiResponse::success($result, status: 201);
    }

    public function update(AttendanceUpdateRequest $request, Attendance $attendance)
    {
        $result = $this->service->update(
            user: $this->resolveUser(),
            attendance: $attendance,
            input: $request->validated(),
        );

        return ApiResponse::success($result);
    }

    private function resolveUser(): User
    {
        /** @var User|null $authUser */
        $authUser = auth()->user();
        if ($authUser instanceof User) {
            return $authUser;
        }

        /** @var User $fallback */
        $fallback = User::query()->active()->ordered()->firstOrFail();

        return $fallback;
    }
}
