<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\OvertimeRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class OvertimeRequestFactory extends Factory
{
    protected $model = OvertimeRequest::class;

    public function definition(): array
    {
        // ランダムに開始時間を生成
        $start = fake()->dateTimeBetween('-1 month', 'now');
        $startCarbon = Carbon::instance($start);

        // 開始時間から 1~5時間後を終了時間に設定
        $endCarbon = (clone $startCarbon)->addHours(fake()->numberBetween(1, 5));

        return [
            'user_id' => null,
            'work_date' => $startCarbon->format('Y-m-d'),
            'start_time' => $startCarbon->toDateTimeString(),
            'end_time' => $endCarbon->toDateTimeString(),
            'status' => fake()->randomElement([
                OvertimeRequest::STATUS_PENDING,
                OvertimeRequest::STATUS_APPROVED,
                OvertimeRequest::STATUS_RETURNED,
                OvertimeRequest::STATUS_CANCELED,
            ]),
            'reason' => fake()->optional(0.75)->sentence(),
        ];
    }

    public function forUser(?User $user = null): static
    {
        return $this->for($user ?? UserFactory::new(), 'user');
    }
}
