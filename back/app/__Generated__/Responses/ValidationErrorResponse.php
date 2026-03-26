<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

/**
 * バリデーションエラー発生時のHTTPレスポンス
 *
 * @param array<string, string[]> $errors
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class ValidationErrorResponse
{
    public function __construct(
        public string $message,
        public array $errors,
    ) {}
}
