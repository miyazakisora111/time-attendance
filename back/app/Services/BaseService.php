<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Log;

/**
 * 基底のサービスクラス
 */
abstract class BaseService
{
    /**
     * 情報ログを記録する。
     *
     * @param string $message ログメッセージ
     * @param array<string, mixed> $context 追加コンテキスト情報
     *
     * @return void
     */
    protected function log(string $message, array $context = []): void
    {
        Log::info($message, $context);
    }

    /**
     * エラーログを記録する。
     *
     * @param string $message ログメッセージ
     * @param array<string, mixed> $context 追加コンテキスト情報
     *
     * @return void
     */
    protected function logError(string $message, array $context = []): void
    {
        Log::error($message, $context);
    }
}
