<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Http\Responses\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException as FrameworkAuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Throwable;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class Handler extends ExceptionHandler
{
    /**
     * The list of inputs that are never flashed on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'password',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        // ドメイン例外
        $this->renderable(function (\App\Exceptions\DomainException $e, $request) {
            $status = $this->normalizeStatusCode($e->getCode());

            Log::channel('api')->warning('Domain exception', $this->buildContext($request, $e, $status));

            return ApiResponse::error(
                message: $e->getMessage(),
                status: $status
            );
        });

        $this->renderable(function (AuthenticationException $e, $request) {
            Log::channel('api')->warning('Authentication exception', $this->buildContext($request, $e, 401));

            return ApiResponse::error(
                message: $e->getMessage(),
                status: 401
            );
        });

        // 検証エラー
        $this->renderable(function (ValidationException $e, $request) {
            return ApiResponse::error(
                message: 'Validation failed',
                status: 422,
                errors: $e->errors()
            );
        });

        // 未認証
        $this->renderable(function (FrameworkAuthenticationException $e, $request) {
            Log::channel('api')->warning('Framework authentication exception', $this->buildContext($request, $e, 401));

            return ApiResponse::error(
                message: 'Unauthenticated',
                status: 401
            );
        });

        // 権限なし
        $this->renderable(function (AuthorizationException $e, $request) {
            Log::channel('api')->warning('Authorization exception', $this->buildContext($request, $e, 403));

            return ApiResponse::error(
                message: 'Forbidden',
                status: 403
            );
        });

        // その他の例外
        $this->renderable(function (Throwable $e, $request) {
            $status = $this->resolveThrowableStatus($e);

            Log::channel('api')->log(
                $status >= 500 ? 'error' : 'warning',
                'Unhandled exception',
                $this->buildContext($request, $e, $status)
            );

            return ApiResponse::error(
                message: $status >= 500 ? 'Internal Server Error' : $e->getMessage(),
                status: $status
            );
        });
    }

    /**
     * 例外コードを HTTP ステータスに正規化
     */
    private function normalizeStatusCode(int $code): int
    {
        return $code >= 400 && $code < 600 ? $code : 500;
    }

    private function resolveThrowableStatus(Throwable $e): int
    {
        if ($e instanceof HttpExceptionInterface) {
            return $this->normalizeStatusCode($e->getStatusCode());
        }

        return $this->normalizeStatusCode((int) $e->getCode());
    }

    private function buildContext($request, Throwable $e, int $status): array
    {
        return [
            'method' => $request->method(),
            'endpoint' => $request->path(),
            'status_code' => $status,
            'exception' => $e::class,
            'error_message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ];
    }
}
