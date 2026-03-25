<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Logging\LogContextBuilder;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

/**
 * APIの入出力を自動的にログへ記録するミドルウェア
 */
final class LogApiRequest
{
    /**
     * コンストラクタ
     * 
     * @param LogContextBuilder $logContextBuilder ログコンテキストビルダー
     */
    public function __construct(
        private LogContextBuilder $logContextBuilder,
    ) {}

    /**
     * 実行する。
     * 
     * @param Request $request HTTPリクエスト
     * @param Closure $next 次のミドルウェア
     * @return SymfonyResponse HTTPレスポンス
     */
    public function handle(Request $request, Closure $next): SymfonyResponse
    {
        /** @var SymfonyResponse $response */
        $response = $next($request);

        $statusCode = $response->getStatusCode();
        $level = $this->resolveLogLevel($statusCode);

        // ログへ記録する。
        Log::channel('api')->log(
            level: $level,
            message: 'API request completed',
            context: $this->logContextBuilder->fromRequestAndResponse($request, $response),
        );

        return $response;
    }

    /**
     * HTTPステータスコードからログレベルを決定する。
     * 
     * @param int $statusCode HTTPステータスコード
     * @return string ログレベル
     */
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
}
