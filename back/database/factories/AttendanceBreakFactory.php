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
        $breakStart = fake()->dateTimeBetween('-1 month', 'now');

        return [
            'attendance_id' => AttendanceFactory::new(),
            'break_start' => $breakStart->format('H:i:s'),
            'break_end' => fake()->optional(0.8)->dateTimeBetween($breakStart, '+90 minutes')?->format('H:i:s'),
        ];
    }

    public function forAttendance(?Attendance $attendance = null): static
    {
        return $this->for($attendance ?? AttendanceFactory::new(), 'attendance');
    }
}
