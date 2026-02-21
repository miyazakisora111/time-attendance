<?php

declare(strict_types=1);

namespace App\ValueObjects;

use App\Exceptions\DomainException;

/**
 * EmailのValueObjectクラス
 */
final readonly class Email extends BaseValueObject
{
    /**
     * メール形式を検証する。
     *
     * @param string $value 値 
     * @throws DomainException
     */
    protected function assert(string $value): void
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new DomainException("Invalid email format.");
        }
    }
}
