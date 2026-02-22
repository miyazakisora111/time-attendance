<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * 権限の例外クラス
 */
final class AuthorizationException extends RuntimeException
{
    public function __construct(
        string $message = '権限がありません',
        int $statusCode = 403,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $statusCode, $previous);
    }
}