<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

/**
 * イベントとリスナーのマッピングを登録するサービスプロバイダー
 */
class EventServiceProvider extends ServiceProvider
{
    /**
     * イベントと対応するリスナーのマッピング
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [];

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
