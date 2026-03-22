<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Role>
 */
class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        $roles = [
            ['name' => '代表取締役', 'level' => 5],
            ['name' => '部長', 'level' => 4],
            ['name' => '課長', 'level' => 3],
            ['name' => 'チームリーダー', 'level' => 2],
            ['name' => '一般社員', 'level' => 1],
        ];

        $role = fake()->randomElement($roles);

        return [
            'name' => $role['name'],
            'level' => $role['level'],
            'sort_order' => fake()->numberBetween(1, 100),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }

    public function active(): static
    {
        return $this->state(fn(): array => [
            'status' => 'active',
        ]);
    }
}
