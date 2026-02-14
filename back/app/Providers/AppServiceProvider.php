<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
    }
}
