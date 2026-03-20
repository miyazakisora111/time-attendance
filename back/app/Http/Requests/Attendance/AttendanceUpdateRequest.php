<?php

declare(strict_types=1);

namespace App\Http\Requests\Attendance;

use App\Http\Requests\BaseRequest;

class AttendanceUpdateRequest extends BaseRequest
{
    /**
     * {@inheritdoc}
     */
    protected string $schemaName = 'AttendanceUpdateRequest';
}
