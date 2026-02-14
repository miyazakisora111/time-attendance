<?php

declare(strict_types=1);

namespace App\DTO;

use ReflectionClass;
use ReflectionNamedType;
use BackedEnum;
use DateTimeImmutable;

abstract class BaseDTO
{
    public static function fromArray(array $data): static
    {
        $reflection = new ReflectionClass(static::class);
        $constructor = $reflection->getConstructor();

        $args = [];

        foreach ($constructor->getParameters() as $param) {
            $name = $param->getName();
            $type = $param->getType();
            $value = $data[$name] ?? null;

            if ($value === null) {
                $args[] = null;
                continue;
            }

            if ($type instanceof ReflectionNamedType) {
                $typeName = $type->getName();

                // Enum対応
                if (is_subclass_of($typeName, BackedEnum::class)) {
                    $args[] = $typeName::from($value);
                    continue;
                }

                // Date対応
                if ($typeName === DateTimeImmutable::class) {
                    $args[] = new DateTimeImmutable($value);
                    continue;
                }

                // ValueObject対応（fromがあれば）
                if (method_exists($typeName, 'from')) {
                    $args[] = $typeName::from($value);
                    continue;
                }
            }

            $args[] = $value;
        }

        return new static(...$args);
    }

    public function toArray(): array
    {
        $reflection = new ReflectionClass($this);
        $result = [];

        foreach ($reflection->getProperties() as $property) {
            $property->setAccessible(true);
            $value = $property->getValue($this);

            if ($value instanceof BackedEnum) {
                $result[$property->getName()] = $value->value;
                continue;
            }

            if ($value instanceof DateTimeImmutable) {
                $result[$property->getName()] = $value->format(DATE_ATOM);
                continue;
            }

            if (is_object($value) && method_exists($value, 'value')) {
                $result[$property->getName()] = $value->value();
                continue;
            }

            $result[$property->getName()] = $value;
        }

        return $result;
    }
}
