<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use App\Exceptions\AuthenticationException;
use App\Models\User;
use App\ValueObjects\Email;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

/**
 * 認証のサービスクラス
 */
class AuthService
{
    /**
     * Eメールとパスワードでユーザーを認証する。
     *
     * @param Email $email Eメール
     * @param string $password パスワード
     *
     * @return array{User: User, token: string}
     * 
     * @throws UnauthorizedHttpException
     */
    public function login(Email $email, string $password): array
    {
        // パスワードを確認します。
        $user = User::where('email', $email)->first();
        if (!$user || !Hash::check($password, $user->password)) {
            throw new \InvalidArgumentException('認証情報が正しくありません');
        }

        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            throw new \RuntimeException('トークン生成に失敗しました');
        }

        return [
            'token' => JWTAuth::fromUser($user),
            'ttl' => config('jwt.ttl'),
            'user' => $user,
        ];
    }

    /**
     * 現在の認証ユーザー情報を整形して返す。
     *
     * @return array<string, mixed> 認証ユーザー情報
     *
     * @throws AuthenticationException
     */
    public function getUser(): array
    {
        // ユーザーを取得する。
        $user = Auth::user();

        // 認証の例外を投げる。
        if (!$user) {
            throw new AuthenticationException();
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name'),
            'settings' => $user->settings ?? null,
            'isAuthenticated' => true,
        ];
    }
}
