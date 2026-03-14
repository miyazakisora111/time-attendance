<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Holiday;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Holiday>
 */
class HolidayFactory extends Factory
{
    protected $model = Holiday::class;

    public function definition(): array
    {
        return [
            'holiday_date' => fake()->dateTimeBetween('now', '+1 year')?->format('Y-m-d'),
            'name' => fake()->randomElement([
                '元日',
                '成人の日',
                '建国記念の日',
                '昭和の日',
                '憲法記念日',
                '海の日',
                '山の日',
                '敬老の日',
                '文化の日',
                '勤労感謝の日',
            ]),
        ];
    }
}
