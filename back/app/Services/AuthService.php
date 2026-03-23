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
    /**
     * コンストラクタ
     * 
     * @param UserService $userService ユーザーサービス
     */
    public function __construct(
        private readonly UserService $userService,
    ) {}

    /**
     * ユーザーを認証する。
     *
     * @param Email $email Eメール
     * @param string $password パスワード
     * @param Request $request リクエスト
     *
     * @return array<string, mixed> JWTトークンのレスポンス
     */
    public function login(Email $email, string $password, Request $request): array
    {
        // 認証を行う。
        $guard = $this->guard();
        $token = $guard->attempt(credentials: [
            'email' => $email->value(),
            'password' => $password,
            'status' => 1,
        ]);
        if (!is_string($token) || $token === '') {
            throw new DomainException('認証に失敗しました');
        }

        // ユーザーを取得する。
        $user = $guard->user();
        if (!$user instanceof User) {
            throw new DomainException('ユーザーの取得に失敗しました');
        }

        // ログイン日時を更新する。
        $user->update([
            'last_login_at' => now(),
        ]);

        // ログイン履歴を記録する。
        $this->recordLoginHistory($user, $request);

        // JWTトークンのレスポンスを生成する。
        return $this->respondWithToken($token);
    }

    /**
     * JWT トークンをリフレッシュする。
     *
     * @return array<string, mixed> JWTトークンのレスポンス
     */
    public function refresh(): array
    {
        try {
            // トークンをリフレッシュする。
            $guard = $this->guard();
            $token = $guard->refresh();
        } catch (\Throwable $e) {
            throw new AuthenticationException('トークン更新に失敗しました');
        }

        // JWTトークンのレスポンスを生成する。
        return $this->respondWithToken($token);
    }

    /**
     * ログアウトする。
     *
     * @return void
     */
    public function logout(): void
    {
        // ログアウト履歴を記録する。
        $user = $this->userService->getAuthUser();
        $this->closeLoginHistory($user);

        // ログアウトする。
        $this->guard()->logout();
    }

    /**
     * 認証済みユーザーの情報を取得する。
     *
     * @return array<string, mixed> 認証済みユーザーの情報
     */
    public function getUser(): array
    {
        // リレーションをロードする。
        $user = $this->userService->getAuthUser();
        $user->loadMissing([
            'role:id,name',
            'userSetting',
        ]);

        // ユーザーを返却する。
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
     *
     * @param User $user ユーザー
     * @param Request|null $request リクエスト
     * @return LoginHistory ログイン履歴
     */
    private function recordLoginHistory(User $user, Request $request): LoginHistory
    {
        return LoginHistory::query()->create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'logged_in_at' => now(),
        ]);
    }

    /**
     * ログアウト履歴を記録する。
     *
     * @param User $user ユーザー
     * @return LoginHistory ログイン履歴
     */
    private function closeLoginHistory(User $user): LoginHistory
    {
        return LoginHistory::query()
            ->user($user->id)
            ->active()
            ->latestLogin()
            ->first()
            ?->update(['logged_out_at' => now()]);
    }

    /**
     * JWTトークンのレスポンスを生成する。
     *
     * @param string $token JWT トークン
     * @return array JWTトークンのレスポンス
     */
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
