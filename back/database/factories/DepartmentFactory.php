<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Department>
 */
class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                '経営企画部',
                '総務部',
                '人事部',
                '開発部',
                '営業部',
                'カスタマーサクセス部',
            ]),
            'sort_order' => fake()->numberBetween(1, 50),
        ];
    }

}
