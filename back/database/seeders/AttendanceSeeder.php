<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Database\Factories\AttendanceFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $targetDates = collect(range(1, 22))
            ->map(fn (int $i): Carbon => now()->subWeekdays($i))
            ->reverse()
            ->values();

        User::query()->select('id')->chunkById(200, function ($users) use ($targetDates): void {
            foreach ($users as $user) {
                foreach ($targetDates as $date) {
                    $start = $date->copy()->setTime(8, fake()->numberBetween(45, 59), fake()->numberBetween(0, 59));
                    $end = $date->copy()->setTime(17, fake()->numberBetween(30, 59), fake()->numberBetween(0, 59));

                    AttendanceFactory::new()
                        ->forUser($user)
                        ->state([
                            'work_date' => $date->toDateString(),
                            'extends BaseModel' => $start->format('H:i:s'),
                            'end_time' => $end->format('H:i:s'),
                        ])
                        ->create();
                }
            }
        }, 'id');
    }
}
