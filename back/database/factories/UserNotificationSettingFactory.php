<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use App\Models\UserNotificationSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserNotificationSetting>
 */
class UserNotificationSettingFactory extends Factory
{
    protected $model = UserNotificationSetting::class;

    public function definition(): array
    {
        return [
            'user_id' => UserFactory::new(),
            'clock_in_reminder' => fake()->boolean(),
            'approval_notification' => fake()->boolean(),
            'leave_reminder' => fake()->boolean(),
        ];
    }

    public function forUser(?User $user = null): static
    {
        return $this->for($user ?? UserFactory::new(), 'user');
    }
}
