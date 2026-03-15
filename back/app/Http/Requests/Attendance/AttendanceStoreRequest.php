<?php

declare(strict_types=1);

namespace App\Http\Requests\Attendance;

use App\Http\Requests\BaseRequest;

class AttendanceStoreRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'work_date' => ['required', 'date_format:Y-m-d'],
            'clock_in_local_time' => ['required', 'date_format:H:i'],
            'clock_out_local_time' => ['nullable', 'date_format:H:i'],
            'clock_out_next_day' => ['required', 'boolean'],
            'work_timezone' => ['required', 'timezone:all'],
            'break_minutes' => ['nullable', 'integer', 'min:0', 'max:720'],
            'note' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
