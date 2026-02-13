<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Models\Observers\UserObserver;

/**
 * AppServiceProvider
 * 
 * アプリケーション全体のサービスプロバイダー。
 * バインディングと初期化を管理します。
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * 登録
     */
    public function register(): void
    {
        // シングルトンをバインド
        $this->app->singleton(\App\Services\MailService::class, function ($app) {
            return new \App\Services\MailService();
        });

        $this->app->singleton(\App\Services\External\StripeClient::class, function ($app) {
            return new \App\Services\External\StripeClient(
                config('services.stripe.secret')
            );
        });

        $this->app->singleton(\App\Services\PaymentService::class, function ($app) {
            return new \App\Services\PaymentService(
                $app->make(\App\Services\External\StripeClient::class)
            );
        });

        // リポジトリをバインド
        $this->app->bind(\App\Repositories\UserRepository::class, function ($app) {
            return new \App\Repositories\UserRepository();
        });

        // ユースケースをバインド
        $this->app->bind(\App\UseCases\User\CreateUser::class, function ($app) {
            return new \App\UseCases\User\CreateUser(
                $app->make(\App\Repositories\UserRepository::class)
            );
        });

        $this->app->bind(\App\UseCases\User\UpdateUser::class, function ($app) {
            return new \App\UseCases\User\UpdateUser(
                $app->make(\App\Repositories\UserRepository::class)
            );
        });

        $this->app->bind(\App\UseCases\User\DeactivateUser::class, function ($app) {
            return new \App\UseCases\User\DeactivateUser(
                $app->make(\App\Repositories\UserRepository::class)
            );
        });

        // アクションをバインド
        $this->app->bind(\App\Actions\User\SyncUserAction::class, function ($app) {
            return new \App\Actions\User\SyncUserAction(
                $app->make(\App\Repositories\UserRepository::class)
            );
        });
    }

    /**
     * ブート
     */
    public function boot(): void
    {
        // オブザーバーを登録
        User::observe(UserObserver::class);
    }
}
