<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Responses\ApiResponse;
use App\Services\AuthService;
use App\ValueObjects\Email;
use Illuminate\Http\JsonResponse;

/**
 * 認証のコントローラー
 */
final class AuthController extends BaseController
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
        $validated = $request->validated();

        // ログイン処理を行う。
        $result = $this->service->login(
            email: new Email($validated['email']),
            password: $validated['password'],
            request: $request,
        );

        return ApiResponse::success($result);
    }

    /**
     * ログアウトする。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function logout(): JsonResponse
    {
        // ログアウトする。
        $this->service->logout();
        return ApiResponse::success();
    }

    /**
     * トークンをリフレッシュする。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function refresh(): JsonResponse
    {
        $result = $this->service->refresh();
        return ApiResponse::success($result);
    }

    /**
     * ログインユーザーを取得する。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function me(): JsonResponse
    {
        $result = $this->service->getUser();
        return ApiResponse::success($result);
    }
}
