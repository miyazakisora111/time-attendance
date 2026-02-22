<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * ドメインの例外クラス
 */
class DomainException extends RuntimeException
{
    public function __construct(
        string $message = 'ドメインの例外です',
        int $statusCode = 422,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $statusCode, $previous);
    }
}
