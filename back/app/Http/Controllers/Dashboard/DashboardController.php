<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\BaseController;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends BaseController
{
    public function __construct(
        private readonly DashboardService $service,
    ) {}

    public function show(): JsonResponse
    {
        $result = $this->service->getDashboard(
            user: $this->resolveUser(),
        );

        return ApiResponse::success($result);
    }

    public function clock(Request $request): JsonResponse
    {
        $result = $this->service->clock(
            user: $this->resolveUser(),
            action: (string) $request->input('action', ''),
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
