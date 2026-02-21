<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Policies\UserPolicy;

/**
 * 認可ポリシーを登録します。
 */
class AuthServiceProvider extends ServiceProvider
{
    /**
     * ポリシーのマッピング
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
    ];

    /**
     * 認可の登録
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
