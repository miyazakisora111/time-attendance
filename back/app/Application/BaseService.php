<?php

declare(strict_types=1);

namespace App\Application;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Traits\Timezone;

/**
 * 基底のサービスクラス
 */
abstract class BaseService
{
    use Timezone;

    /**
     * 情報ログを記録する。
     *
     * @param string $message ログメッセージ
     * @param array<string, mixed> $context 追加コンテキスト情報
     */
    protected function log(string $message, array $context = []): void
    {
        Log::info($message, $context);
    }

    /**
     * 警告ログを記録する。
     *
     * @param string $message ログメッセージ
     * @param array<string, mixed> $context 追加コンテキスト情報
     */
    protected function logWarning(string $message, array $context = []): void
    {
        Log::warning($message, $context);
    }

    /**
     * エラーログを記録する。
     *
     * @param string $message ログメッセージ
     * @param array<string, mixed> $context 追加コンテキスト情報
     */
    protected function logError(string $message, array $context = []): void
    {
        Log::error($message, $context);
    }

    /**
     * トランザクション内でコールバックを実行する。
     *
     * @template T
     * @param callable(): T $callback
     * @return T
     *
     * @throws \Throwable コールバック内で発生した例外はそのまま再送出する
     */
    protected function transaction(callable $callback): mixed
    {
        try {
            $result = DB::transaction($callback);

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
    }

    /**
     * Carbon 日付から日本語曜日（1文字）を返す。
     *
     * @param Carbon $date 対象日付
     * @return string 「日」〜「土」
     */
    protected function weekdayJa(Carbon $date): string
    {
        return ['日', '月', '火', '水', '木', '金', '土'][$date->dayOfWeek];
    }
}
