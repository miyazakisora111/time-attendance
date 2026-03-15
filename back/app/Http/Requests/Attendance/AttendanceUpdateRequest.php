<?php

declare(strict_types=1);

namespace App\Http\Requests\Attendance;

use App\Http\Requests\BaseRequest;

class AttendanceUpdateRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'work_date' => ['sometimes', 'required', 'date_format:Y-m-d'],
            'clock_in_local_time' => ['sometimes', 'required', 'date_format:H:i'],
            'clock_out_local_time' => ['sometimes', 'nullable', 'date_format:H:i'],
            'clock_out_next_day' => ['sometimes', 'required', 'boolean'],
            'work_timezone' => ['sometimes', 'required', 'timezone:all'],
            'break_minutes' => ['sometimes', 'required', 'integer', 'min:0', 'max:720'],
            'note' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
