<?php

namespace App\Traits;

trait Timezone
{
    /**
     * タイムゾーン文字列を解決する。
     *
     * @param string|null $timezone タイムゾーン
     * @return string 有効なタイムゾーン文字列
     */
    protected function resolveTimezone(?string $timezone): string
    {
        return (is_string($timezone) && $timezone !== '')
            ? $timezone
            : config('app.timezone');
    }
}
