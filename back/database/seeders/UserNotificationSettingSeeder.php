<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserNotificationSetting;
use Database\Factories\UserNotificationSettingFactory;
use Illuminate\Database\Seeder;

class UserNotificationSettingSeeder extends Seeder
{
    public function run(): void
    {
        User::query()
            ->select('id')
            ->chunkById(200, function ($users): void {
                foreach ($users as $user) {
                    if (!UserNotificationSetting::query()->where('user_id', $user->id)->exists()) {
                        UserNotificationSettingFactory::new()->forUser($user)->create();
                    }
                }
            }, 'id');
    }
}
