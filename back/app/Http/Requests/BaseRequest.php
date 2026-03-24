<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\__Generated__\OpenApiGeneratedRules;

/**
 * 基底のHTTPリクエスト
 */
abstract class BaseRequest extends FormRequest
{
    /**
     * OpenAPI スキーマ名
     *
     * @var string
     */
    protected string $schemaName;

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
     * コンストラクタ
     */
    public function __construct()
    {
        // クラス名からスキーマ名を設定
        $this->schemaName = class_basename(static::class);
    }


    /**
     * このリクエストが実行可能かどうかを判定する
     *
     * @return bool リクエストを許可するかどうか
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * リクエストのバリデーションルールを定義する
     *
     * @return array バリデーションルール配列
     */
    public function rules(): array
    {
        return OpenApiGeneratedRules::schema($this->schemaName);
    }

    /**
     * {@inheritdoc}
     */
    public function attributes(): array
    {
        return OpenApiGeneratedRules::schemaAttributes($this->schemaName);
    }

    /**
     * {@inheritdoc}
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // 数値フィルタを適用
        foreach ($this->filters['number'] ?? [] as $column) {
            $data[$column] = $this->filterNumber($this->input($column));
        }

        // 真偽値フィルタを適用
        foreach ($this->filters['boolean'] ?? [] as $column) {
            $data[$column] = $this->filterBoolean($this->input($column));
        }

        // 正規化した値をリクエストにマージ
        if (!empty($data)) {
            $this->merge($data);
        }
    }

    /**
     * 数値入力を正規化する
     *
     * @param mixed $value ユーザー入力値
     * @return int|float|null 正規化された数値。変換不可の場合は null
     */
    protected function filterNumber(mixed $value): int|float|null
    {
        if ($value === null) {
            return null;
        }

        // 全角数字を半角に変換し、カンマを削除してトリム
        $value = mb_convert_kana((string) $value, 'n');
        $value = str_replace(',', '', $value);
        $value = trim($value);

        // 数字以外の文字が含まれている場合
        if (!is_numeric($value)) {
            return null;
        }

        // 小数点を含むかで整数か浮動小数点数に変換
        return str_contains($value, '.')
            ? (float) $value
            : (int) $value;
    }

    /**
     * 真偽値入力を正規化する
     *
     * @param mixed $value ユーザー入力値
     * @return bool|null 正規化された真偽値。変換不可の場合は null
     */
    protected function filterBoolean(mixed $value): ?bool
    {
        if ($value === null) {
            return null;
        }

        // 真偽値に変換
        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }
}
