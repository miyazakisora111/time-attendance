<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\AuthenticationException;
use App\DTO\UserProfile;
use App\Models\User;
use App\ValueObjects\Email;
use Tymon\JWTAuth\JWTGuard;

class AuthService extends BaseService
{
    /**
     * Eメールとパスワードでユーザーを認証する。
     *
     * @param Email $email Eメール
     * @param string $password パスワード
     *
     * @return array<string, mixed>
     */
    public function login(Email $email, string $password): array
    {
        $guard = $this->guard();

        $credentials = [
            'email' => $email->value(),
            'password' => $password,
            'status' => 1,
        ];

        $token = $guard->attempt($credentials);

        if (!is_string($token) || $token === '') {
            throw new AuthenticationException('認証に失敗しました');
        }

        /** @var User|null $user */
        $user = $guard->user();

        if (!$user instanceof User) {
            throw new AuthenticationException('ユーザーの取得に失敗しました');
        }

        $user->update([
            'last_login_at' => now(),
        ]);

        return $this->respondWithToken($token);
    }

    public function refresh(): array
    {
        $guard = $this->guard();

        try {
            $token = $guard->refresh();
        } catch (\Throwable $e) {
            throw new AuthenticationException('トークン更新に失敗しました');
        }

        return $this->respondWithToken($token);
    }

    public function logout(): void
    {
        $this->guard()->logout();
    }

    public function getUser(): array
    {
        $guard = $this->guard();

        /** @var User|null $user */
        $user = $guard->user();

        if (!$user instanceof User || !$user->exists) {
            throw new AuthenticationException('ユーザーが存在しません');
        }

        $user->loadMissing([
            'role:id,name',
            'userSetting',
        ]);

        return [
            'user' => (new UserProfile(
                id: $user->id,
                name: $user->name,
                email: $user->email,
                roles: $user->role !== null ? [$user->role->name] : [],
                settings: $user->userSetting?->toArray(),
            ))->toArray(),
        ];
    }

    private function respondWithToken(string $token): array
    {
        return [
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60,
        ];
    }

    private function guard(): JWTGuard
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return $guard;
    }
}
