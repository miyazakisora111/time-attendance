<?php

declare(strict_types=1);

namespace App\Http\Requests\Attendance;

use App\Http\Requests\BaseRequest;

/**
 * カレンダーのリクエストクラス
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

    /**
     * {@inheritdoc}
     */
    protected string $schemaName = 'CalendarIndexRequest';
}
