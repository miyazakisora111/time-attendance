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

class CustomizeApiLog
{
    /**
     * APIログを JSON 形式に統一し、全レコードに共通 context を自動付与する。
     *
     * @param IlluminateLogger $logger Laravel が渡す Logger
     */
    public function __invoke(IlluminateLogger $logger): void
    {
        // Monolog インスタンスにアクセス
        /** @var MonologLogger $monolog */
        $monolog = $logger->getLogger();

        // JSON フォーマッタをすべての FormattableHandler に設定
        foreach ($monolog->getHandlers() as $handler) {
            if ($handler instanceof FormattableHandlerInterface) {
                $handler->setFormatter(new JsonFormatter(JsonFormatter::BATCH_MODE_JSON, true));
            }
        }

        // 共通 Processor を追加
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
