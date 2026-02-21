<?php

declare(strict_types=1);

namespace App\Http\Requests\DashBoard;

use App\Http\Requests\BaseRequest;

/**
 * カレンダーのリクエストクラス
 */
class CalendarIndexRequest extends BaseRequest
{
    /**
     * {@inheritdoc}
     */
    protected $filters = [
        "number" => [
            "year",
            "month",
        ],
    ];

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
}
