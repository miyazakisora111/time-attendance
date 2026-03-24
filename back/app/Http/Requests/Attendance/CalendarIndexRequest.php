<?php

declare(strict_types=1);

namespace App\Http\Requests\Attendance;

use App\Http\Requests\BaseRequest;

/**
 * カレンダー取得のリクエスト
 */
class CalendarIndexRequest extends BaseRequest
{
    /**
     * {@inheritdoc}
     */
    protected array $filters = [
        "number" => [
            "year",
            "month",
        ],
    ];
}
