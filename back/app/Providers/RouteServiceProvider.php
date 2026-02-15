<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/';

    public function boot(): void
    {
        // 制限時間の設定
        RateLimiter::for('api', function (Request $request) {
            if (app()->environment('local')) {
                return Limit::none();
            }

            return Limit::perMinute(60)->by($request->ip());
        });

        $this->routes(function () {

            // API
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // Web（動作確認用）
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
