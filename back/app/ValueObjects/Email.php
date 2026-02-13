<?php

declare(strict_types=1);

namespace App\ValueObjects;

use App\Exceptions\DomainException;

/**
 * Email ValueObject
 * 
 * メールアドレスをValueObjectとして表現し、
 * ビジネスロジックと検証を一元化します。
 */
final readonly class Email
{
    private string $value;

    public function __construct(string $email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new DomainException("Invalid email format: {$email}");
        }

        $this->value = strtolower(trim($email));
    }

    public function value(): string
    {
        return $this->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    /**
     * ドメイン部分を取得
     */
    public function domain(): string
    {
        $parts = explode('@', $this->value);
        return $parts[1] ?? '';
    }

    /**
     * ローカル部分を取得
     */
    public function localPart(): string
    {
        $parts = explode('@', $this->value);
        return $parts[0] ?? '';
    }
}
