<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Models\PaidLeaveRequest;
use App\Models\OvertimeRequest;
use App\Policies\UserPolicy;
use App\Policies\PaidLeaveRequestPolicy;
use App\Policies\OvertimeRequestPolicy;

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
        PaidLeaveRequest::class => PaidLeaveRequestPolicy::class,
        OvertimeRequest::class => OvertimeRequestPolicy::class,
    ];

    /**
     * 認可の登録
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
