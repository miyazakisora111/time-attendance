<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Application\Queries\UserQuery;
use App\Http\Controllers\BaseController;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * 認証済みユーザー自身の情報を取得する
 */
final class MeController extends BaseController
{
    /**
     * コンストラクタ
     *
     * @param UserQuery $userQuery ユーザー取得クエリ
     */
    public function __construct(
        private readonly UserQuery $userQuery,
    ) {}

    /**
     * 認証済みユーザーのプロフィール情報を取得する
     *
     * @return JsonResponse
     */
    public function __invoke(): JsonResponse
    {
        $result = $this->userQuery->getUserProfile(user: $this->resolveAuthUser());
        return ApiResponse::success($result);
    }
}
