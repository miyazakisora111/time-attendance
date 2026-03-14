<?php

declare(strict_types=1);

namespace Database\Seeders;

use Database\Factories\RoleFactory;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        RoleFactory::new()->count(8)->create();
    }
}
