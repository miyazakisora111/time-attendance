<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * SetJsonContentType Middleware
 * 
 * API レスポンスのContent-Typeをapplication/jsonに設定します。
 */
class SetJsonContentType
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response instanceof \Illuminate\Http\JsonResponse || 
            $request->wantsJson() || 
            $request->is('api/*')) {
            $response->header('Content-Type', 'application/json');
        }

        return $response;
    }
}
