<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Login;

/**
 * ログイン成功のHTTPレスポンス
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class LoginResponse
{
    public function __construct(
        public string $token,
    ) {}
}
