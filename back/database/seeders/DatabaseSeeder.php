<?php

declare(strict_types=1);

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 冪等性を確保するため、全テーブルを CASCADE でトランケートする（PostgreSQL 対応）。
        DB::statement('TRUNCATE
            paid_leave_grants,
            holidays,
            attendance_breaks,
            attendances,
            login_histories,
            user_notification_settings,
            user_settings,
            users,
            departments,
            roles
            CASCADE');

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
            HolidaySeeder::class,
        ]);
    }
}
