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
}
