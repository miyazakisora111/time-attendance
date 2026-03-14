<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Database\Factories\PaidLeaveGrantFactory;
use Illuminate\Database\Seeder;

class PaidLeaveGrantSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->select('id')->chunkById(200, function ($users): void {
            foreach ($users as $user) {
                PaidLeaveGrantFactory::new()
                    ->count(fake()->numberBetween(1, 2))
                    ->forUser($user)
                    ->create();
            }
        }, 'id');
    }
}
