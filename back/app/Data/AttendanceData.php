<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Attendance;

class AttendanceData extends BaseData
{
    public function __construct(
        public readonly int $id,
        public readonly int $userId,
        public readonly string $workDate,
        public readonly string $clockStatus,
        public readonly int $breakMinutes,
        public readonly int $workedMinutes,
    ) {}

    public static function fromModel(Attendance $attendance): self
    {
        return new self(
            id: $attendance->id,
            userId: $attendance->user_id,
            workDate: $attendance->work_date->toDateString(),
            clockStatus: $attendance->resolveClockStatus()->value,
            breakMinutes: $attendance->calculateBreakMinutes(),
            workedMinutes: $attendance->calculateWorkedMinutes(),
        );
    }
}
