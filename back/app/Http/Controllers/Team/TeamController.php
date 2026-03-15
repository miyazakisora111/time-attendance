<?php

declare(strict_types=1);

namespace App\Http\Controllers\Team;

use App\Http\Controllers\BaseController;
use App\Http\Responses\ApiResponse;
use App\Services\TeamService;
use Illuminate\Http\JsonResponse;

/**
 * チームメンバー情報のコントローラー。
 */
final class TeamController extends BaseController
{
    /**
     * コンストラクタ。
     */
    public function __construct(
        private readonly TeamService $service,
    ) {}

    /**
     * チームメンバー一覧を返す。
     */
    public function index(): JsonResponse
    {
        $result = $this->service->listMembers();

        return ApiResponse::success($result);
    }
}
