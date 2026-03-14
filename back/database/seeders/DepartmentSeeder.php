<?php

declare(strict_types=1);

namespace Database\Seeders;

use Database\Factories\DepartmentFactory;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        DepartmentFactory::new()->count(6)->create();
    }
}
