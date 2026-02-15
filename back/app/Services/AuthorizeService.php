<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use App\ValueObjects\Email;

/**
 * 認証のサービスクラス
 */
class AuthorizeService
{
    /**
     * Eメールとパスワードでユーザーを認証する。
     *
     * @param Email $email Eメール
     * @param string $password パスワード
     *
     * @return array{User: User, token: string}
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
}
