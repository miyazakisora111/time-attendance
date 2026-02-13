<?php

declare(strict_types=1);

namespace App\Services;

/**
 * BaseService
 * 
 * すべてのサービスの基底クラス。
 * ビジネスロジックの再利用可能な部分を提供します。
 */
abstract class BaseService
{
    /**
     * ログを記録
     */
    protected function log(string $message, array $context = []): void
    {
        \Illuminate\Support\Facades\Log::info($message, $context);
    }

    /**
     * エラーログを記録
     */
    protected function logError(string $message, array $context = []): void
    {
        \Illuminate\Support\Facades\Log::error($message, $context);
    }
}
