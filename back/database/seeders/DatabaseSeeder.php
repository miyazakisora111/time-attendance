<?php

declare(strict_types=1);

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            DepartmentSeeder::class,
            UserSeeder::class,
            UserSettingSeeder::class,
            UserNotificationSettingSeeder::class,
            LoginHistorySeeder::class,
            AttendanceSeeder::class,
            AttendanceBreakSeeder::class,
            PaidLeaveGrantSeeder::class,
            PaidLeaveRequestSeeder::class,
            OvertimeRequestSeeder::class,
            HolidaySeeder::class,
        ]);
    }
}
