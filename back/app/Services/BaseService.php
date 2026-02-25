<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\DB;
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

    /**
     * トランザクション実行ラッパー
     *
     * @template T
     * @param callable():T $callback
     * @return T
     *
     * @throws Throwable
     */
    protected function transaction(callable $callback)
    {
        return DB::transaction(function () use ($callback) {
            try {
                $result = $callback();

                $this->log('Transaction committed', [
                    'service' => static::class,
                ]);

                return $result;
            } catch (\Throwable $e) {

                $this->logError('Transaction failed', [
                    'service' => static::class,
                    'error' => $e->getMessage(),
                ]);

                throw $e;
            }
        });
    }
}
