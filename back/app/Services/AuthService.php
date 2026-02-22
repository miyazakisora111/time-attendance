<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use App\Models\User;
use App\ValueObjects\Email;

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
        // ユーザーを取得する。
        $user = User::where('email', $email->value())->first();

        // 認証を行う。
        if (!$user || !Hash::check($password, $user->password)) {
            throw new UnauthorizedHttpException('', 'Invalid credentials');
        }

        return [
            'user' => $user,
            'token' => $user->createToken('api-token')->plainTextToken,
        ];
    }

    /**
     * 現在の認証ユーザー情報を整形して返す。
     *
     * @return array<string, mixed> 認証ユーザー情報
     *
     * @throws \Illuminate\Auth\AuthenticationException
     */
    public function getUser(): array
    {
        // ユーザーを取得する。
        $user = Auth::user();

        // 認証の例外を投げる。
        if (!$user) {
            throw new \Illuminate\Auth\AuthenticationException('未認証です');
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
