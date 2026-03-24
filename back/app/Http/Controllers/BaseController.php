<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use App\Application\AuthUserProvider;
use Illuminate\Routing\Controller;

/**
 * 基底のコントローラー
 */
abstract class BaseController extends Controller
{
    /**
     * 認証済みユーザーを取得する。
     *
     * @return User 認証済みユーザー
     */
    protected function resolveAuthUser(): User
    {
        return app(AuthUserProvider::class)->getAuthUser();
    }
}
