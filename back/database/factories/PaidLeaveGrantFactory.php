<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PaidLeaveGrant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaidLeaveGrant>
 */
class PaidLeaveGrantFactory extends Factory
{
    protected $model = PaidLeaveGrant::class;

    public function definition(): array
    {
        $grantedAt = fake()->dateTimeBetween('-2 years', 'now');

        return [
            'user_id' => null,
            'days' => fake()->randomElement([1.0, 2.0, 5.0, 10.0, 10.5]),
            'granted_at' => $grantedAt->format('Y-m-d'),
            'expires_at' => fake()->optional(0.8)->dateTimeBetween($grantedAt, '+2 years')?->format('Y-m-d'),
        ];
    }

    public function forUser(?User $user = null): static
    {
        return $this->for($user ?? UserFactory::new(), 'user');
    }
}
