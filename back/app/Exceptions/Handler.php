<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Http\Responses\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Illuminate\Http\Request;
use Throwable;

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
        // 検証エラー
        $this->renderable(function (ValidationException $e, $request) {
            return ApiResponse::error(
                message: 'Validation failed',
                status: 422,
                errors: $e->errors(),
                code: 'VALIDATION_ERROR'
            );
        });

        // ドメイン例外
        $this->renderable(function (DomainException $e, $request) {
            Log::channel('api')->warning('Domain exception', $this->buildContext($request, $e, 400));

            return ApiResponse::error(
                message: $e->getMessage(),
                status: 400,
                code: $e->getErrorCode()
            );
        });

        // 認証エラー
        $this->renderable(function (AuthenticationException $e, $request) {
            Log::channel('api')->warning('Authentication exception', $this->buildContext($request, $e, 401));

            return ApiResponse::error(
                message: $e->getMessage(),
                status: 401,
                code: 'AUTH_ERROR'
            );
        });

        // 認可エラー
        $this->renderable(function (AuthorizationException $e, $request) {
            Log::channel('api')->warning('Authorization exception', $this->buildContext($request, $e, 403));

            return ApiResponse::error(
                message: $e->getMessage(),
                status: 403,
                code: 'FORBIDDEN_ERROR'
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
                status: $status,
                code: 'INTERNAL_ERROR'
            );
        });
    }

    /**
     * HTTPステータスコードを正規化する。
     *
     * @param int $code HTTPステータスコード
     * @param int $defaultStatus 不正な場合に使用するHTTPステータスコード
     * @return int HTTPステータスコード
     */
    private function normalizeStatusCode(int $code, int $defaultStatus = 500): int
    {
        return $code >= 400 && $code < 600 ? $code : $defaultStatus;
    }

    /**
     * 例外オブジェクトからHTTPステータスコードを解決する。
     * 
     * @param Throwable $e 例外オブジェクト
     * @return int HTTPステータスコード
     */
    private function resolveThrowableStatus(Throwable $e): int
    {
        // HttpExceptionInterface を実装している場合は、そのHTTPステータスコードを使用する
        if ($e instanceof HttpExceptionInterface) {
            return $this->normalizeStatusCode($e->getStatusCode());
        }

        return $this->normalizeStatusCode((int) $e->getCode());
    }

    /**
     * 例外発生時のコンテキスト情報を構築する。
     * 
     * @param Request $request HTTPリクエスト
     * @param Throwable $e 例外オブジェクト
     * @param int $status HTTPステータスコード
     * @return array<string, mixed> コンテキスト情報
     */
    private function buildContext(Request $request, Throwable $e, int $status): array
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
