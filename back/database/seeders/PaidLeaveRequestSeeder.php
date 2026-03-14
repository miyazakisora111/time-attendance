<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\PaidLeaveRequest;
use App\Models\User;
use Database\Factories\PaidLeaveRequestFactory;
use Illuminate\Database\Seeder;

class PaidLeaveRequestSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->select('id')->chunkById(200, function ($users): void {
            foreach ($users as $user) {
                foreach (range(1, 3) as $offset) {
                    PaidLeaveRequestFactory::new()
                        ->forUser($user)
                        ->state([
                            'leave_date' => now()->addMonths(2)->addDays($offset * 3)->toDateString(),
                            'status' => fake()->randomElement([
                                PaidLeaveRequest::STATUS_PENDING,
                                PaidLeaveRequest::STATUS_APPROVED,
                                PaidLeaveRequest::STATUS_REJECTED,
                            ]),
                        ])
                        ->create();
                }
            }
        }, 'id');
    }
}
