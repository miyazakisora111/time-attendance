<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Responses\Factories\UserResponseFactory;
use App\Http\Controllers\BaseController;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * ユーザー自身の情報を取得する
 */
final class MeController extends BaseController
{
    /**
     * コンストラクタ
     *
     * @param UserResponseFactory $factory ユーザーレスポンスファクトリ
     */
    public function __construct(
        private readonly UserResponseFactory $factory,
    ) {}

    /**
     * ユーザーのプロフィール情報を取得する
     *
     * @return JsonResponse JSONレスポンス
     */
    public function __invoke(): JsonResponse
    {
        $result = $this->factory->fromUser(user: $this->resolveAuthUser());
        return ApiResponse::success($result);
    }
}
