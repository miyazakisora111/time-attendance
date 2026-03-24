<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * ドメインの例外クラス
 */
class DomainException extends RuntimeException
{
    /**
     * エラーコード
     */
    protected string $errorCode;

    /**
     * コンストラクタ
     * 
     * @param string $message エラーメッセージ
     * @param string $errorCode エラーコード
     */
    public function __construct(
        string $message,
        string $errorCode = 'DOMAIN_ERROR'
    ) {
        parent::__construct($message);
        $this->errorCode = $errorCode;
    }

    /**
     * エラーコードを取得する。
     * 
     * @return string エラーコード
     */
    public function getErrorCode(): string
    {
        return $this->errorCode;
    }
}
