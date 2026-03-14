<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoginHistory>
 */
class LoginHistoryFactory extends Factory
{
    protected $model = LoginHistory::class;

    public function definition(): array
    {
        $loggedInAt = fake()->dateTimeBetween('-6 months', 'now');

        return [
            'user_id' => null,
            'ip_address' => fake()->optional(0.95)->ipv4(),
            'user_agent' => fake()->optional(0.9)->userAgent(),
            'logged_in_at' => $loggedInAt,
            'logged_out_at' => fake()->optional(0.8)->dateTimeBetween($loggedInAt, 'now'),
        ];
    }

    public function forUser(?User $user = null): static
    {
        return $this->for($user ?? UserFactory::new(), 'user');
    }
}
