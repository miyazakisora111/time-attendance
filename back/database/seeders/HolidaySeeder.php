<?php

declare(strict_types=1);

namespace Database\Seeders;

use Database\Factories\HolidayFactory;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $year = (int) now()->year;

        $holidays = [
            ['date' => sprintf('%d-01-01', $year), 'name' => '元日'],
            ['date' => sprintf('%d-02-11', $year), 'name' => '建国記念の日'],
            ['date' => sprintf('%d-04-29', $year), 'name' => '昭和の日'],
            ['date' => sprintf('%d-05-03', $year), 'name' => '憲法記念日'],
            ['date' => sprintf('%d-05-04', $year), 'name' => 'みどりの日'],
            ['date' => sprintf('%d-05-05', $year), 'name' => 'こどもの日'],
            ['date' => sprintf('%d-08-11', $year), 'name' => '山の日'],
            ['date' => sprintf('%d-11-03', $year), 'name' => '文化の日'],
            ['date' => sprintf('%d-11-23', $year), 'name' => '勤労感謝の日'],
        ];

        foreach ($holidays as $holiday) {
            HolidayFactory::new()
                ->state([
                    'holiday_date' => $holiday['date'],
                    'name' => $holiday['name'],
                ])
                ->create();
        }
    }
}
