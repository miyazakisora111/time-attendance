<?php

declare(strict_types=1);

namespace App\__Generated__\Responses\Attendance;

use App\__Generated__\Enums\ClockStatus;

/**
 * 勤怠レコードの表示用のHTTPレスポンス
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class AttendanceResponse
{
    public function __construct(
        public ?string $userId = null,
        public ?string $workDate = null,
        public ?ClockStatus $clockStatus = null,
        public ?string $clockInAt = null,
        public ?string $clockOutAt = null,
        public ?int $breakMinutes = null,
        public ?int $workedMinutes = null,
        public ?int $overtimeMinutes = null,
    ) {}
}
