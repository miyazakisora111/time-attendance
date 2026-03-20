<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
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
     * 未認証の場合は有効ユーザーの先頭をフォールバックとして返す。
     *
     * @return User
     */
    protected function resolveUser(): User
    {
        /** @var User|null $authUser */
        $authUser = auth()->user();

        if ($authUser instanceof User) {
            return $authUser;
        }

        /** @var User $fallback */
        $fallback = User::query()->active()->ordered()->firstOrFail();

        return $fallback;
    }
}
