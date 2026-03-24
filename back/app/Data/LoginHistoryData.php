<?php

namespace App\Data;

use App\Http\Requests\BaseRequest;
use DateTimeImmutable;

/**
 * ログイン履歴のデータ
 */
final class LoginHistoryData extends BaseData
{
    /**
     * コンストラクタ
     * 
     * @param mixed $ipAddress IPアドレス
     * @param mixed $userAgent ユーザーエージェント
     * @param DateTimeImmutable $loggedInAt ログイン日時
     */
    public function __construct(
        public readonly ?string $ipAddress,
        public readonly ?string $userAgent,
        public readonly DateTimeImmutable $loggedInAt,
    ) {}

    /**
     * リクエストからデータを作成
     * 
     * @param BaseRequest $request HTTPリクエスト
     * @return LoginHistoryData ログイン履歴データ
     */
    public static function fromRequest(BaseRequest $request): self
    {
        return new self(
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
            loggedInAt: new DateTimeImmutable(),
        );
    }
}
