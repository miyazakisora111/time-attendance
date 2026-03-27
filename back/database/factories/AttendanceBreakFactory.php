<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\AttendanceBreak;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttendanceBreak>
 */
class AttendanceBreakFactory extends Factory
{
    protected $model = AttendanceBreak::class;

    public function definition(): array
    {
        $breakStartAt = fake()->dateTimeBetween('-1 month', 'now');

        return [
            'attendance_id' => null,
            'break_start_at' => $breakStartAt->format('H:i:s'),
            'break_end_at' => fake()->optional(0.8)->dateTimeBetween($breakStartAt, '+90 minutes')?->format('H:i:s'),
        ];
    }

    public function forAttendance(?Attendance $attendance = null): static
    {
        return $this->for($attendance ?? AttendanceFactory::new(), 'attendance');
    }
}
