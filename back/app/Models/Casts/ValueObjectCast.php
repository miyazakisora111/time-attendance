<?php

namespace App\Models\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

/**
 * 抽象キャストクラス
 */
abstract class ValueObjectCast implements CastsAttributes
{
    /**
     * 対象となるValueObjectクラス名を返す。
     * 
     * @return string ValueObjectクラス名
     */
    abstract protected function valueObjectClass(): string;

    /**
     * 値をValueObjectへ変換する。
     *
     * @param mixed $value 値
     * @return object ValueObject
     */
    public function get($model, string $key, $value, array $attributes): object
    {
        $class = $this->valueObjectClass();

        return new $class($value);
    }

    /**
     * ValueObjectを値へ変換する。
     *
     * @param mixed $value ValueObject
     * @return mixed 値
     */
    public function set($model, string $key, $value, array $attributes): mixed
    {
        if (is_object($value) && method_exists($value, 'value')) {
            return $value->value();
        }

        return $value;
    }
}
