<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\OvertimeRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OvertimeRequest>
 */
class OvertimeRequestFactory extends Factory
{
    protected $model = OvertimeRequest::class;

    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-1 month', 'now');

        return [
            'user_id' => UserFactory::new(),
            'work_date' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'start_time' => $start->format('H:i:s'),
            'end_time' => fake()->dateTimeBetween($start, '+5 hours')->format('H:i:s'),
            'status' => fake()->randomElement([
                OvertimeRequest::STATUS_PENDING,
                OvertimeRequest::STATUS_APPROVED,
                OvertimeRequest::STATUS_RETURNED,
                OvertimeRequest::STATUS_CANCELED,
            ]),
            'reason' => fake()->optional(0.75)->sentence(),
        ];
    }

    public function forUser(?User $user = null): static
    {
        return $this->for($user ?? UserFactory::new(), 'user');
    }
}
