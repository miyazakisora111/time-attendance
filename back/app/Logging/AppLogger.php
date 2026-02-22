<?php

namespace App\Logging;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AppLogger
{
    /**
     * APIリクエストをログに出力
     *
     * @param string $method HTTPメソッド
     * @param string $endpoint エンドポイント
     * @param int $statusCode HTTPステータスコード
     * @param array $context その他情報（IP, User-Agentなど）
     */
    public static function logApiCall(
        string $method,
        string $endpoint,
        int $statusCode,
        array $context = []
    ): void {
        $context = [
            self::mergeContext($context),
            'method' => $method,
            'endpoint' => $endpoint,
            'status_code' => $statusCode,
        ];

        // ステータスによってログレベルを自動決定
        if ($statusCode >= 500) {
            self::error('APIリクエストエラー', $context);
        } elseif ($statusCode >= 400) {
            self::warning('APIリクエスト警告', $context);
        } else {
            self::info('APIリクエスト成功', $context);
        }
    }

    /**
     * infoレベルログ
     */
    public static function info(string $message, array $context = []): void
    {
        Log::channel(self::getChannel())->info($message, self::mergeContext($context));
    }

    /**
     * warningレベルログ
     */
    public static function warning(string $message, array $context = []): void
    {
        Log::channel(self::getChannel())->warning($message, self::mergeContext($context));
    }

    /**
     * errorレベルログ
     */
    public static function error(string $message, array $context = []): void
    {
        Log::channel(self::getChannel())->error($message, self::mergeContext($context));
    }

    /**
     * デフォルトコンテキストをマージ
     */
    protected static function mergeContext(array $context): array
    {
        return array_merge([
            'request_id' => request()->header('X-Request-ID') ?? Str::uuid(),
            'user_id' => auth()->id(),
        ], $context);
    }

    /**
     * 現在環境に応じてチャンネルを選択
     */
    protected static function getChannel(): string
    {
        return config('app.env') === 'production' ? 'stack' : 'daily';
    }
}
