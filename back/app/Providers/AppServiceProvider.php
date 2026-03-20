<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Request;
use App\ValueObjects\Email;

/**
 * アプリケーション全体のサービスプロバイダー。
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * 登録
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Email を取得するマクロ
        Request::macro('emailVO', function () {
            /** @var \App\Http\Requests\BaseRequest $this */
            return new Email($this->validated('email'));
        });
    }
}
