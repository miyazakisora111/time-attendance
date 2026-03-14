<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Role;
use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $departments = Department::query()->get();
        $roles = Role::query()->where('status', 'active')->get();

        for ($i = 0; $i < 60; $i++) {
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
