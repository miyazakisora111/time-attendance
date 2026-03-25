<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => '代表取締役', 'sort_order' => 1],
            ['name' => '部長',       'sort_order' => 2],
            ['name' => '課長',       'sort_order' => 3],
            ['name' => 'チームリーダー', 'sort_order' => 4],
            ['name' => '一般社員',   'sort_order' => 5],
        ];

        foreach ($roles as $role) {
            Role::query()->firstOrCreate(['name' => $role['name']], $role);
        }
    }
}
