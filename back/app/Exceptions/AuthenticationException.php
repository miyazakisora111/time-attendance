<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * 未認証の例外クラス
 */
final class AuthenticationException extends RuntimeException
{
    public function __construct(
        string $message = '未認証です',
        int $statusCode = 401,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $statusCode, $previous);
    }
}
