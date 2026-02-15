<?php

declare(strict_types=1);

namespace App\Http\Requests\DashBoard;

use Illuminate\Foundation\Http\FormRequest;

/**
 * カレンダーのリクエストクラス
 */
class CalendarIndexRequest extends FormRequest
{
    /**
     * 認可判定
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルールを定義する。
     *
     * @return array<string, array<int, string>> バリデーションルール
     */
    public function rules(): array
    {
        return [
            'year'  => ['required', 'integer', 'min:2000', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
        ];
    }

    public function year(): int
    {
        return (int) $this->validated('year');
    }

    public function month(): int
    {
        return (int) $this->validated('month');
    }
}
