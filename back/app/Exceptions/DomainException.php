<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * ドメイン層の業務例外クラス。
 *
 * ビジネスルール違反など、業務的に想定されるエラーを表す。
 * 認証・認可には使用しないこと（Laravel 標準例外を使う）。
 */
class DomainException extends RuntimeException
{
    protected string $errorCode;

    public function __construct(
        string $message,
        string $errorCode = 'DOMAIN_ERROR'
    ) {
        parent::__construct($message);
        $this->errorCode = $errorCode;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }
}
