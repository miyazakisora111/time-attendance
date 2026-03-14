<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PaidLeaveRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaidLeaveRequest>
 */
class PaidLeaveRequestFactory extends Factory
{
    protected $model = PaidLeaveRequest::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'leave_date' => fake()->dateTimeBetween('-1 month', '+2 months')->format('Y-m-d'),
            'days' => fake()->randomElement([0.5, 1.0]),
            'status' => fake()->randomElement([
                PaidLeaveRequest::STATUS_PENDING,
                PaidLeaveRequest::STATUS_APPROVED,
                PaidLeaveRequest::STATUS_REJECTED,
            ]),
            'reason' => fake()->optional(0.7)->sentence(),
        ];
    }

    public function forUser(?User $user = null): static
    {
        return $this->for($user ?? UserFactory::new(), 'user');
    }
}
