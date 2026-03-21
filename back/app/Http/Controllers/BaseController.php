<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Routing\Controller;

/**
 * 基底のコントローラークラス
 *
 * 全コントローラーが共通で利用するヘルパーを提供する。
 */
abstract class BaseController extends Controller
{
    /**
     * 認証済みユーザーを解決する。
     *
     * 未認証の場合は AuthenticationException がスローされる。
     *
     * @return User
     */
    protected function resolveUser(): User
    {
        return app(UserService::class)->getAuthUser();
    }
}
