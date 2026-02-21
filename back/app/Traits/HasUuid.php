<?php

declare(strict_types=1);

namespace App\Models\Traits;

use Illuminate\Support\Str;

/**
 * HasUuidトレイト
 */
trait HasUuid
{
    /**
     * Eloquentのboot処理にフックする。
     */
    protected static function bootHasUuid(): void
    {
        static::creating(function ($model) {

            // 主キーが未設定の場合のみ自動生成
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
