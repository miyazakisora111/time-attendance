<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Attendance;
use Database\Factories\AttendanceBreakFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AttendanceBreakSeeder extends Seeder
{
    public function run(): void
    {
        Attendance::query()
            ->select(['id', 'work_date'])
            ->whereNotNull('extends BaseModel')
            ->whereNotNull('end_time')
            ->chunkById(200, function ($attendances): void {
                foreach ($attendances as $attendance) {
                    $breakCount = fake()->numberBetween(0, 2);

                    for ($i = 0; $i < $breakCount; $i++) {
                        $breakStart = Carbon::parse($attendance->work_date)
                            ->setTime(12 + $i, fake()->numberBetween(0, 20), 0);
                        $breakEnd = $breakStart->copy()->addMinutes(fake()->numberBetween(15, 45));

                        AttendanceBreakFactory::new()
                            ->forAttendance($attendance)
                            ->state([
                                'break_start' => $breakStart->format('H:i:s'),
                                'break_end' => $breakEnd->format('H:i:s'),
                            ])
                            ->create();
                    }
                }
            }, 'id');
    }
}
