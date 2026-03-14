<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $departments = Department::query()->get();
        $roles = Role::query()->where('status', 'active')->get();

        $defaultUser = User::query()->firstOrNew(['email' => 'test@test.com']);
        $defaultUser->fill([
            'name' => 'テストユーザー',
            'password' => 'Password@1',
            'status' => 1,
            'sort_order' => 1,
            'email_verified_at' => now(),
        ]);

        if ($departments->isNotEmpty()) {
            $defaultUser->department()->associate($departments->first());
        }

        if ($roles->isNotEmpty()) {
            $defaultUser->role()->associate($roles->first());
        }

        $defaultUser->save();

        for ($i = 0; $i < 59; $i++) {
            $factory = UserFactory::new()->active();

            if ($departments->isNotEmpty()) {
                $factory = $factory->forDepartment($departments->random());
            }

            if ($roles->isNotEmpty()) {
                $factory = $factory->forRole($roles->random());
            }

            $factory->create();
        }
    }
}
