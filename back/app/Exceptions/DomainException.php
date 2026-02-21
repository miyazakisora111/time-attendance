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
    /**
     * ステータスコード
     */
    protected int $statusCode;

    public function __construct(
        string $message = 'Domain error.',
        int $statusCode = 422,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);
        $this->statusCode = $statusCode;
    }

    /**
     * HTTPステータスコードを取得する。
     * 
     * @return int ステータスコード
     */
    public function statusCode(): int
    {
        return $this->statusCode;
    }
}
