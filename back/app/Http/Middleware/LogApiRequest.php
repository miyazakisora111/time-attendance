<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Logging\AppLogger;
use Illuminate\Support\Facades\Auth;

/**
 * APIリクエストをログに記録するミドルウェア
 */
class LogApiRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        AppLogger::logApiCall(
            method: $request->method(),
            endpoint: $request->path(),
            statusCode: $response->status(),
            context: [
                'user_agent' => $request->userAgent(),
                'ip' => $request->ip(),
            ],
        );

        return $response;
    }
}
