<?php

declare(strict_types=1);

namespace App\Services;

use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use App\Exceptions\AuthenticationException;
use App\Models\User;
use App\ValueObjects\Email;
use App\DTO\UserProfile;

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
        if (!($token = auth()->attempt([
            'email' => $email->value(),
            'password' => $password
        ]))) {
            throw new AuthenticationException('認証に失敗しました');
        }

        $user = auth()->user();

        $user->update([
            'last_login_at' => now(),
        ]);

        return $this->respondWithToken($token);
    }

    public function refresh(): array
    {
        try {
            $token = auth()->refresh();
        } catch (\Exception $e) {
            throw new AuthenticationException('トークン更新に失敗しました');
        }

        return $this->respondWithToken($token);
    }

    public function logout(): void
    {
        auth()->logout(); // blacklistへ
    }

    public function getUser(User $user): UserProfile
    {
        // N+1防止
        $user->loadMissing([
            'roles:id,name',
            'settings',
        ]);

        if (!$user->exists) {
            throw new AuthenticationException('ユーザーが存在しません');
        }

        return new UserProfile(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            roles: $user->roles->pluck('name')->toArray(),
            settings: $user->settings?->toArray(),
        );
    }

    private function respondWithToken(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ];
    }
}
