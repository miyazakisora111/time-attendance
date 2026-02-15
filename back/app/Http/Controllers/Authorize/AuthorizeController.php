<?php

declare(strict_types=1);

namespace App\Http\Controllers\Authorize;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Authorize\LoginRequest;
use App\Http\Responses\ApiResponse;
use App\Services\AuthorizeService;
use Illuminate\Http\JsonResponse;

/**
 * 認証のコントローラー
 */
class AuthorizeController extends BaseController
{
    /**
     * コンストラクタ
     * 
     * @param AuthorizeService $service 認証のサービス
     */
    public function __construct(
        private readonly AuthorizeService $service,
    ) {}

    /**
     * ログイン処理を行う。
     *
     * @param LoginRequest $request リクエスト
     * @return JsonResponse Jsonレスポンス
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // ログイン処理を行う。
        $result = $this->service->login(
            email: $request->email(),
            password: $request->password(),
        );

        return ApiResponse::success($result);
    }
}
