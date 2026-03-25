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
            ['name' => '代表取締役'],
            ['name' => '部長'],
            ['name' => '課長'],
            ['name' => 'チームリーダー'],
            ['name' => '一般社員'],
        ];

        $role = fake()->randomElement($roles);

        return [
            'name' => $role['name'],
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }
}
