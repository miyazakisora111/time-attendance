<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

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
        public string $userId,
        public string $workDate,
        public ClockStatus $clockStatus,
        public ?string $clockInAt,
        public ?string $id = null,
        public ?string $clockOutAt = null,
        public ?int $breakMinutes = null,
        public ?int $workedMinutes = null,
    ) {}
}
