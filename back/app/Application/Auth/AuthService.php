<?php

declare(strict_types=1);

namespace App\Application\Auth;

use App\Application\BaseService;
use App\Exceptions\DomainException;
use App\Data\LoginHistoryData;
use App\Infrastructure\User\Persistence\UserRepository;
use App\Models\User;
use App\ValueObjects\Email;
use Illuminate\Auth\AuthenticationException;
use Tymon\JWTAuth\JWTGuard;

/**
 * 認証のサービス
 */
final class AuthService extends BaseService
{
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

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
        ]);
        if (!is_string($token) || $token === '') {
            throw new DomainException('メールアドレスまたはパスワードが正しくありません');
        }

        // ユーザーを取得する。
        $user = $guard->user();
        if (!$user instanceof User) {
            throw new DomainException('ユーザーの取得に失敗しました');
        }

        // ログイン日時を更新する。
        $this->userRepository->updateLastLoginAt($user);

        // ログイン履歴を記録する。
        $this->userRepository->createLoginHistory($user, $loginHistoryData);

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
        $this->userRepository->closeLatestLoginHistory($user);

        // ログアウトする。
        $this->guard()->logout();
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
