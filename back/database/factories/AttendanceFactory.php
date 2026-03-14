<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition(): array
    {
        $startDateTime = fake()->optional(0.95)->dateTimeBetween('-2 months', 'now');

        return [
            'user_id' => UserFactory::new(),
            'work_date' => fake()->dateTimeBetween('-2 months', 'now')->format('Y-m-d'),
            'start_time' => $startDateTime?->format('H:i:s'),
            'end_time' => $startDateTime === null
                ? null
                : fake()->optional(0.85)->dateTimeBetween($startDateTime, '+4 hours')->format('H:i:s'),
        ];
    }

    public function forUser(?User $user = null): static
    {
        return $this->for($user ?? UserFactory::new(), 'user');
    }

    public function workingNow(): static
    {
        return $this->state(fn (): array => [
            'start_time' => fake()->dateTimeBetween('-4 hours', '-30 minutes')->format('H:i:s'),
            'end_time' => null,
        ]);
    }
}
