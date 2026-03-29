<?php

declare(strict_types=1);

namespace App\Application\Attendance\DTO;

final class AttendanceReadModel
{
    public function __construct(
        public readonly ?int $id,
        public readonly ?int $userId,
        public readonly ?string $workDate,
        public readonly ?string $clockInAt,
        public readonly ?string $clockOutAt,
        public readonly int $breakMinutes,
        public readonly int $workedMinutes,
        public readonly int $overtimeMinutes,
        public readonly string $clockStatus,
    ) {}
}
