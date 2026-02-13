<?php

declare(strict_types=1);

namespace App\Models\Casts;

use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use InvalidArgumentException;

/**
 * JsonCast カスタムキャスト
 * 
 * JSON型カラムをネイティブに扱うためのカスト。
 * PHP 8.4のファーストクラスコールブルを活用できます。
 */
class JsonCast implements CastsAttributes
{
    public function get($model, $key, $value, $attributes): mixed
    {
        if ($value === null) {
            return null;
        }

        $decoded = json_decode($value, true, 512, JSON_THROW_ON_ERROR);

        if (!is_array($decoded)) {
            return [];
        }

        return $decoded;
    }

    public function set($model, $key, $value, $attributes): string
    {
        if ($value === null) {
            return json_encode(null);
        }

        if (!is_array($value)) {
            throw new InvalidArgumentException(
                "JSON cast expects array, got " . gettype($value)
            );
        }

        return json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }
}
