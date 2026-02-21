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
     * DBから取得した値をValueObjectへ変換する。
     *
     * @param mixed $value DBに保存されている値
     * @return object ValueObjectインスタンス
     */
    public function get($model, string $key, $value, array $attributes): object
    {
        $class = $this->valueObjectClass();

        return new $class($value);
    }

    /**
     * ValueObjectをDB保存可能な値へ変換する。
     *
     * @param mixed $value ValueObject または プリミティブ値
     * @return mixed 永続化可能な値
     */
    public function set($model, string $key, $value, array $attributes): mixed
    {
        if (is_object($value) && method_exists($value, 'value')) {
            return $value->value();
        }

        return $value;
    }
}
