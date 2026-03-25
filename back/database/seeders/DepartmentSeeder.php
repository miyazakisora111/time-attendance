<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => '経営企画部',         'sort_order' => 1],
            ['name' => '総務部',             'sort_order' => 2],
            ['name' => '人事部',             'sort_order' => 3],
            ['name' => '開発部',             'sort_order' => 4],
            ['name' => '営業部',             'sort_order' => 5],
            ['name' => 'カスタマーサクセス部', 'sort_order' => 6],
        ];

        foreach ($departments as $dept) {
            Department::query()->firstOrCreate(['name' => $dept['name']], $dept);
        }
    }
}
