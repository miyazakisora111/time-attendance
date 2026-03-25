<?php

declare(strict_types=1);

namespace App\Http\Controllers\Team;

use App\Http\Controllers\BaseController;
use App\Http\Responses\ApiResponse;
use App\Application\Team\TeamService;
use Illuminate\Http\JsonResponse;

/**
 * チームのコントローラー
 */
final class TeamController extends BaseController
{
    /**
     * コンストラクタ
     * 
     * @param TeamService $service チームのサービス
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
