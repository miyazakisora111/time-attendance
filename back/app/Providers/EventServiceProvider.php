<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\UserCreated;
use App\Listeners\SendWelcomeMail;

/**
 * EventServiceProvider
 * 
 * イベントとリスナーのマッピングを定義します。
 */
class EventServiceProvider extends ServiceProvider
{
    /**
     * イベントと対応するリスナーのマッピング
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        UserCreated::class => [
            SendWelcomeMail::class,
        ],
    ];

    /**
     * ブート
     */
    public function boot(): void
    {
        //
    }

    /**
     * リスナーを検出するかを判定
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
