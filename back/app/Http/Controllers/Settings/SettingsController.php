<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Settings\ChangePasswordRequest;
use App\Http\Requests\Settings\UpdateSettingsRequest;
use App\Http\Responses\ApiResponse;
use App\Application\Services\SettingsService;
use Illuminate\Http\JsonResponse;

/**
 * 設定のコントローラー
 */
final class SettingsController extends BaseController
{
    /**
     * コンストラクタ
     * 
     * @param SettingsService $service 設定のサービス
     */
    public function __construct(
        private readonly SettingsService $service,
    ) {}

    /**
     * ユーザー設定を返す。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function show(): JsonResponse
    {
        // ユーザー設定を取得する。
        $result = $this->service->getSettings(
            user: $this->resolveAuthUser(),
        );

        return ApiResponse::success($result);
    }

    /**
     * ユーザー設定を更新する。
     *
     * @param UpdateSettingsRequest $request 設定更新HTTPリクエスト
     * @return JsonResponse JSONレスポンス
     */
    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        // ユーザ設定を更新する。
        $result = $this->service->updateSettings(
            user: $this->resolveAuthUser(),
            input: $request->validated(),
        );

        return ApiResponse::success($result);
    }

    /**
     * パスワードを変更する。
     *
     * @param ChangePasswordRequest $request パスワード変更HTTPリクエスト
     * @return JsonResponse JSONレスポンス
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        // パスワードを変更する。
        $result = $this->service->changePassword(
            user: $this->resolveAuthUser(),
            input: $request->validated(),
        );

        return ApiResponse::success($result);
    }

    /**
     * ログイン履歴一覧を返す。
     *
     * @return JsonResponse JSONレスポンス
     */
    public function loginHistories(): JsonResponse
    {
        // ログイン履歴一覧を返す。
        $result = $this->service->getLoginHistories(
            user: $this->resolveAuthUser(),
        );

        return ApiResponse::success($result);
    }
}
