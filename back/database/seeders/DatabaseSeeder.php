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
        // 冪等性を確保するため、依存関係の逆順でテーブルをトランケートする。
        DB::statement('SET CONSTRAINTS ALL DEFERRED');

        DB::table('overtime_requests')->truncate();
        DB::table('paid_leave_requests')->truncate();
        DB::table('paid_leave_grants')->truncate();
        DB::table('holidays')->truncate();
        DB::table('attendance_breaks')->truncate();
        DB::table('attendances')->truncate();
        DB::table('login_histories')->truncate();
        DB::table('user_notification_settings')->truncate();
        DB::table('user_settings')->truncate();
        DB::table('users')->truncate();
        DB::table('departments')->truncate();
        DB::table('roles')->truncate();

        DB::statement('SET CONSTRAINTS ALL IMMEDIATE');

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
