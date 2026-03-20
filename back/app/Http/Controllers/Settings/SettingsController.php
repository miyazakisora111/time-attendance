<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Settings\UpdateSettingsRequest;
use App\Http\Responses\ApiResponse;
use App\Services\SettingsService;
use Illuminate\Http\JsonResponse;

/**
 * 設定画面のコントローラー。
 */
final class SettingsController extends BaseController
{
    /**
     * コンストラクタ。
     */
    public function __construct(
        private readonly SettingsService $service,
    ) {}

    /**
     * ログインユーザー設定を返す。
     *
     * @return JsonResponse Jsonレスポンス
     */
    public function show(): JsonResponse
    {
        $result = $this->service->getSettings(
            user: $this->resolveUser(),
        );

        return ApiResponse::success($result);
    }

    /**
     * ログインユーザー設定を更新する。
     *
     * @param UpdateSettingsRequest $request 設定更新リクエスト
     * @return JsonResponse Jsonレスポンス
     */
    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        $result = $this->service->updateSettings(
            user: $this->resolveUser(),
            input: $request->validated(),
        );

        return ApiResponse::success($result);
    }
}
