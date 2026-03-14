<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

/**
 * API の入出力を構造化ログとして自動記録するミドルウェア
 */
class LogApiRequest
{
    public function handle(Request $request, Closure $next): SymfonyResponse
    {
        /** @var SymfonyResponse $response */
        $response = $next($request);

        $statusCode = $response->getStatusCode();
        $level = $this->resolveLogLevel($statusCode);

        Log::channel('api')->log(
            level: $level,
            message: 'API request completed',
            context: [
                'method' => $request->method(),
                'endpoint' => $request->path(),
                'status_code' => $statusCode,
                'request' => [
                    'query' => $request->query(),
                    'body' => $request->except(['password', 'password_confirmation']),
                ],
                'response' => $this->extractResponseBody($response),
            ],
        );

        return $response;
    }

    private function resolveLogLevel(int $statusCode): string
    {
        if ($statusCode >= 500) {
            return 'error';
        }

        if ($statusCode >= 400) {
            return 'warning';
        }

        return 'info';
    }

    /**
     * レスポンス内容を JSON ログ向けに整形する。
     */
    private function extractResponseBody(SymfonyResponse $response): mixed
    {
        if ($response instanceof JsonResponse) {
            return $response->getData(true);
        }

        if ($response instanceof Response) {
            $content = $response->getContent();
            $decoded = json_decode($content, true);

            return json_last_error() === JSON_ERROR_NONE ? $decoded : $content;
        }

        return null;
    }
}
