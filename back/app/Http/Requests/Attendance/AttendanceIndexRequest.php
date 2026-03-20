<?php

declare(strict_types=1);

namespace App\Http\Requests\Attendance;

use App\Http\Requests\BaseRequest;

class AttendanceIndexRequest extends BaseRequest
{
    /**
     * {@inheritdoc}
     */
    protected string $schemaName = 'AttendanceIndexRequest';
}
