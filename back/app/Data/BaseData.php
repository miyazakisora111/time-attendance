<?php

declare(strict_types=1);

namespace App\Data;

use ReflectionClass;
use ReflectionNamedType;
use ReflectionParameter;
use ReflectionType;
use BackedEnum;
use DateTimeImmutable;

/**
 * 基底のDataクラス
 */
abstract class BaseData
{
    /**
     * 配列からクラスを作成する。
     * 
     * @param array $data クラスのプロパティに対応するキーを持つ配列
     * @return BaseData 基底のDataクラス
     */
    public static function fromArray(array $data): static
    {
        $ref = new ReflectionClass(static::class);

        $args = array_map(
            fn(ReflectionParameter $p) => self::convert(
                $p->getType(),
                $data[$p->getName()] ?? null
            ),
            $ref->getConstructor()->getParameters()
        );

        return new static(...$args);
    }

    /**
     * 配列に変換する。
     * 
     * @return array クラスのプロパティに対応するキーを持つ配列
     */
    public function toArray(): array
    {
        $ref = new ReflectionClass($this);

        $result = [];
        foreach ($ref->getProperties() as $prop) {
            $prop->setAccessible(true);
            $value = $prop->getValue($this);

            // 値を型に応じて変換する
            $result[$prop->getName()] = match (true) {
                $value instanceof BackedEnum => $value->value,
                $value instanceof DateTimeImmutable => $value->format(DATE_ATOM),
                is_object($value) && method_exists($value, 'value') => $value->value(),
                default => $value,
            };
        }

        return $result;
    }

    /**
     * 型によって変換する。
     * 
     * @param ReflectionType|null $type 変換先の型
     * @param mixed $value 変換前の値
     * @return mixed 変換後の値
     */
    private static function convert(?ReflectionType $type, mixed $value): mixed
    {
        // 型がない場合・名前付き型でない場合
        if ($value === null || ! $type instanceof ReflectionNamedType) {
            return $value;
        }

        // 値を型に応じて変換する
        $t = $type->getName();
        return match (true) {
            is_subclass_of($t, BackedEnum::class) => $t::from($value),
            $t === DateTimeImmutable::class => new DateTimeImmutable($value),
            method_exists($t, 'from') => $t::from($value),
            default => $value,
        };
    }
}
