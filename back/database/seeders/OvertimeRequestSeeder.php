<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\OvertimeRequest;
use App\Models\User;
use Database\Factories\OvertimeRequestFactory;
use Illuminate\Database\Seeder;

class OvertimeRequestSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->select('id')->chunkById(200, function ($users): void {
            foreach ($users as $user) {
                OvertimeRequestFactory::new()
                    ->count(fake()->numberBetween(2, 4))
                    ->forUser($user)
                    ->state(fn (): array => [
                        'status' => fake()->randomElement([
                            OvertimeRequest::STATUS_PENDING,
                            OvertimeRequest::STATUS_APPROVED,
                            OvertimeRequest::STATUS_RETURNED,
                            OvertimeRequest::STATUS_CANCELED,
                        ]),
                    ])
                    ->create();
            }
        }, 'id');
    }
}
