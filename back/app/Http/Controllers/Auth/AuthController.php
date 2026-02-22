<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Responses\ApiResponse;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

/**
 * 認証のコントローラー
 */
class AuthController extends BaseController
{
    /**
     * コンストラクタ
     * 
     * @param AuthService $service 認証のサービス
     */
    public function __construct(
        private readonly AuthService $service,
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
