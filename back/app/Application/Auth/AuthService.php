<?php

declare(strict_types=1);

namespace App\Application\Auth;

use App\Application\BaseService;
use App\Exceptions\DomainException;
use App\Data\LoginHistoryData;
use App\Models\LoginHistory;
use App\Models\User;
use App\ValueObjects\Email;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tymon\JWTAuth\JWTGuard;

/**
 * 認証のサービス
 */
final class AuthService extends BaseService
{
    /**
     * ユーザーを認証する
     *
     * @param Email $email Eメール
     * @param string $password パスワード
     * @param LoginHistoryData $loginHistoryData ログイン履歴データ
     *
     * @return array<string, mixed> JWTトークンのHTTPレスポンス
     */
    public function login(Email $email, string $password, LoginHistoryData $loginHistoryData): array
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
        $this->recordLoginHistory($user, $loginHistoryData);

        // JWTトークンのHTTPレスポンスを生成する。
        return $this->respondWithToken($token);
    }

    /**
     * JWT トークンをリフレッシュする。
     *
     * @return array<string, mixed> JWTトークンのHTTPレスポンス
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

        // JWTトークンのHTTPレスポンスを生成する。
        return $this->respondWithToken($token);
    }

    /**
     * ログアウトする。
     * 
     * @param User $user ユーザー
     */
    public function logout(User $user): void
    {
        // ログアウト履歴を記録する。
        $this->closeLoginHistory($user);

        // ログアウトする。
        $this->guard()->logout();
    }

    /**
     * ログイン履歴を記録する。
     *
     * @param User $user ユーザー
     * @param Request|null $request HTTPリクエスト
     * @return LoginHistory ログイン履歴
     */
    private function recordLoginHistory(User $user, LoginHistoryData $loginHistoryData): LoginHistory
    {
        return LoginHistory::query()->create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'ip_address' => $loginHistoryData->ipAddress,
            'user_agent' => $loginHistoryData->userAgent,
            'logged_in_at' => $loginHistoryData->loggedInAt,
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
     * JWTトークンのHTTPレスポンスを生成する。
     *
     * @param string $token JWT トークン
     * @return array JWTトークンのHTTPレスポンス
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
