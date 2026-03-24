<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Stringable;
use JsonSerializable;

/**
 * 基底のValueObjectクラス
 */
abstract readonly class BaseValueObject implements Stringable, JsonSerializable
{
    /**
     * 値
     *
     * @var string
     */
    protected string $value;

    /**
     * コンストラクタ
     *
     * @param string $value 値
     */
    final public function __construct(string $value)
    {
        $this->assert($value);
        $this->value = $value;
    }

    /**
     * 値の妥当性を検証する
     *
     * @param string $value 検証対象の値
     */
    abstract protected function assert(string $value): void;

    /**
     * 値を取得する
     *
     * @return string 値
     */
    final public function value(): string
    {
        return $this->value;
    }

    /**
     * 他のValueObjectと等価かどうかを判定する
     *
     * @param self $other 比較対象のValueObject
     * @return bool 値が等しければ true
     */
    final public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    /**
     * {@inheritdoc}
     */
    final public function __toString(): string
    {
        return $this->value;
    }

    /**
     * {@inheritdoc}
     */
    public function jsonSerialize(): mixed
    {
        return $this->value;
    }
}
