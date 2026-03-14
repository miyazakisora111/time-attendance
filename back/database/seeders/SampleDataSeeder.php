<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Database\Factories\AttendanceBreakFactory;
use Database\Factories\AttendanceFactory;
use Database\Factories\DepartmentFactory;
use Database\Factories\HolidayFactory;
use Database\Factories\LoginHistoryFactory;
use Database\Factories\OvertimeRequestFactory;
use Database\Factories\PaidLeaveGrantFactory;
use Database\Factories\PaidLeaveRequestFactory;
use Database\Factories\UserNotificationSettingFactory;
use Database\Factories\UserSettingFactory;
use Illuminate\Database\Seeder;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        DepartmentFactory::new()
            ->count(3)
            ->withUsers(8)
            ->create();

        User::query()->each(function (User $user): void {
            UserSettingFactory::new()->forUser($user)->create();
            UserNotificationSettingFactory::new()->forUser($user)->create();
            LoginHistoryFactory::new()->count(5)->forUser($user)->create();

            $attendances = AttendanceFactory::new()->count(20)->forUser($user)->create();

            $attendances->each(function (\App\Models\Attendance $attendance): void {
                AttendanceBreakFactory::new()
                    ->count(fake()->numberBetween(0, 2))
                    ->forAttendance($attendance)
                    ->create();
            });

            PaidLeaveGrantFactory::new()->count(2)->forUser($user)->create();
            PaidLeaveRequestFactory::new()->count(3)->forUser($user)->create();
            OvertimeRequestFactory::new()->count(4)->forUser($user)->create();
        });

        HolidayFactory::new()->count(20)->create();

        // N+1回避の取得例:
        // $users = User::query()
        //     ->with(['department', 'role'])
        //     ->get();
    }
}
