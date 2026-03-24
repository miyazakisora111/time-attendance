<?php

declare(strict_types=1);

namespace App\Logging;

use Illuminate\Log\Logger as IlluminateLogger;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\FormattableHandlerInterface;
use Monolog\Logger as MonologLogger;
use Monolog\LogRecord;

/**
 * ログをカスタマイズするクラス 
 */
final class CustomizeLog
{
    /**
     * ログをJSON形式に統一し、全レコードに共通contextを自動付与する。
     *
     * @param IlluminateLogger $logger ロガー
     */
    public function __invoke(IlluminateLogger $logger): void
    {
        /** @var MonologLogger $monolog */
        $monolog = $logger->getLogger();

        // JSONフォーマッタをすべてのFormattableHandlerに設定
        foreach ($monolog->getHandlers() as $handler) {
            if ($handler instanceof FormattableHandlerInterface) {
                $handler->setFormatter(new JsonFormatter(JsonFormatter::BATCH_MODE_JSON, true));
            }
        }

        // 共通Processorを追加
        $monolog->pushProcessor(function (LogRecord $record): LogRecord {
            $request = app()->bound('request') ? request() : null;

            return $record->with(extra: array_merge($record->extra, [
                'request_id' => $request?->headers->get('X-Request-ID') ?: (string) Str::uuid(),
                'user_id' => Auth::id(),
                'ip' => $request?->ip(),
                'user_agent' => $request?->userAgent(),
            ]));
        });
    }
}
