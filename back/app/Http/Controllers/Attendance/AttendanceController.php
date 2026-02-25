<?php

declare(strict_types=1);

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Http\Responses\ApiResponse;
use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;

class AttendanceController extends BaseController
{
    public function __construct(
        private AttendanceService $service
    ) {}

    public function clockIn()
    {
        $result = $this->service->clockIn(user: auth()->user());
        return ApiResponse::success($result);
    }

    public function clockOut()
    {
        $result = $this->service->clockOut(user: auth()->user());
        return ApiResponse::success($result);
    }

    public function today()
    {
        $result = $this->service->getToday(user: auth()->user());
        return ApiResponse::success($result);
    }
}
