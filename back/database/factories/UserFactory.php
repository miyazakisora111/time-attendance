<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'department_id' => null,
            'role_id' => null,
            'name' => fake()->name(),
            'sort_order' => fake()->numberBetween(1, 500),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('Password@1'),
            'email_verified_at' => fake()->optional(0.9)->dateTimeBetween('-2 years', 'now'),
            'last_login_at' => fake()->optional(0.7)->dateTimeBetween('-1 year', 'now'),
            'remember_token' => Str::random(10),
        ];
    }

    public function forDepartment(?\App\Models\Department $department = null): static
    {
        return $this->for($department ?? DepartmentFactory::new(), 'department');
    }

    public function forRole(?\App\Models\Role $role = null): static
    {
        return $this->for($role ?? RoleFactory::new(), 'role');
    }
}
