<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserSetting;
use Database\Factories\UserSettingFactory;
use Illuminate\Database\Seeder;

class UserSettingSeeder extends Seeder
{
    public function run(): void
    {
        User::query()
            ->select('id')
            ->chunkById(200, function ($users): void {
                foreach ($users as $user) {
                    if (!UserSetting::query()->where('user_id', $user->id)->exists()) {
                        UserSettingFactory::new()->forUser($user)->create();
                    }
                }
            }, 'id');
    }
}
