<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * 既定のフォームリクエストクラス
 */
abstract class BaseRequest extends FormRequest
{
    /**
     * 正規化対象フィールド定義
     *
     * @var array{
     *     number?: array<int, string>,
     *     boolean?: array<int, string>
     * }
     */
    protected array $filters = [
        'number'  => [],
        'boolean' => [],
    ];

    /**
     * {@inheritdoc}
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        foreach ($this->filters['number'] ?? [] as $column) {
            $data[$column] = $this->filterNumber($this->input($column));
        }

        foreach ($this->filters['boolean'] ?? [] as $column) {
            $data[$column] = $this->filterBoolean($this->input($column));
        }

        if (!empty($data)) {
            $this->merge($data);
        }
    }

    /**
     * 数値入力を正規化する。
     *
     * @param mixed $value ユーザー入力値
     * @return int|float|null 正規化された数値。変換不可の場合は null
     */
    protected function filterNumber(mixed $value): int|float|null
    {
        if ($value === null) {
            return null;
        }

        $value = mb_convert_kana((string) $value, 'n');
        $value = str_replace(',', '', $value);
        $value = trim($value);

        if (!is_numeric($value)) {
            return null;
        }

        return str_contains($value, '.')
            ? (float) $value
            : (int) $value;
    }

    /**
     * 真偽値入力を正規化する。
     *
     * @param mixed $value ユーザー入力値
     * @return bool|null 正規化された真偽値。変換不可の場合は null
     */
    protected function filterBoolean(mixed $value): ?bool
    {
        if ($value === null) {
            return null;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }
}