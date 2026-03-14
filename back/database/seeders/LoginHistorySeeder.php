<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Database\Factories\LoginHistoryFactory;
use Illuminate\Database\Seeder;

class LoginHistorySeeder extends Seeder
{
    public function run(): void
    {
        User::query()->select('id')->chunkById(200, function ($users): void {
            foreach ($users as $user) {
                LoginHistoryFactory::new()
                    ->count(fake()->numberBetween(3, 8))
                    ->forUser($user)
                    ->create();
            }
        }, 'id');
    }
}
