<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use App\Http\Responses\ApiResponse;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
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
        // ドメイン
        $this->renderable(function (DomainException $e, $request) {
            if ($request->expectsJson()) {
                return ApiResponse::error(
                    message: $e->getMessage(),
                    status: $e->getCode()
                );
            }
            abort($e->getCode(), $e->getMessage());
        });

        // 未認証
        $this->renderable(function (AuthenticationException $e, $request) {
            if ($request->expectsJson()) {
                return ApiResponse::error(
                    message: $e->getMessage(),
                    status: $e->getCode(),
                );
            }
            return redirect()->guest(route('login'));
        });

        // 権限なし
        $this->renderable(function (AuthorizationException $e, $request) {
            if ($request->expectsJson()) {
                return ApiResponse::error(
                    message: $e->getMessage(),
                    status: $e->getCode(),
                );
            }
            abort($e->getCode(), $e->getMessage());
        });

        // その他
        $this->renderable(function (Throwable $e, $request) {
            if ($request->expectsJson()) {
                return ApiResponse::error(
                    message: $e->getMessage(),
                    status: $e->getCode(),
                );
            }
        });
    }
}
