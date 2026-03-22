<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\DomainException;
use App\DTO\UserProfile;
use App\Models\LoginHistory;
use App\Models\User;
use App\ValueObjects\Email;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tymon\JWTAuth\JWTGuard;

/**
 * 認証サービス
 */
final class AuthService extends BaseService
{
    public function __construct(
        private readonly UserService $userService,
    ) {}
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
            throw new DomainException('認証に失敗しました');
        }

        /** @var User|null $user */
        $user = $guard->user();
        if (!$user instanceof User) {
            throw new DomainException('ユーザーの取得に失敗しました');
        }

        $user->update([
            'last_login_at' => now(),
        ]);

        $this->recordLoginHistory($user);

        return $this->respondWithToken($token);
    }

    /**
     * JWT トークンをリフレッシュする。
     *
     * @return array<string, mixed>
     */
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

    /**
     * ログアウトする。
     *
     * @return void
     */
    public function logout(): void
    {
        $user = $this->userService->getAuthUser();
        $this->closeLoginHistory($user);
        $this->guard()->logout();
    }

    /**
     * 認証済みユーザーの情報を取得する。
     *
     * @return array<string, mixed>
     */
    public function getUser(): array
    {
        $user = $this->userService->getAuthUser();

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

    /**
     * ログイン履歴を記録する。
     */
    private function recordLoginHistory(User $user): void
    {
        /** @var Request $request */
        $request = app('request');

        LoginHistory::query()->create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'logged_in_at' => now(),
        ]);
    }

    /**
     * ログイン履歴のログアウト日時を記録する。
     */
    private function closeLoginHistory(User $user): void
    {
        LoginHistory::query()
            ->user($user->id)
            ->active()
            ->latestLogin()
            ->first()
            ?->update(['logged_out_at' => now()]);
    }

    private function respondWithToken(string $token): array
    {
        return [
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60,
        ];
    }

    /**
     * JWT ガードを取得する。
     *
     * @return JWTGuard
     */
    private function guard(): JWTGuard
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return $guard;
    }
}
