<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use Illuminate\Auth\AuthenticationException;
use App\Models\User;
use App\Application\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class UserServiceTest extends TestCase
{
    use RefreshDatabase;

    private UserService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(UserService::class);
    }

    /**
     * @test
     * 認証済みユーザーが取得できること
     */
    public function it_returns_authenticated_user(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'api');

        $result = $this->service->getAuthUser();

        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals($user->id, $result->id);
    }

    /**
     * @test
     * 未認証時にAuthenticationExceptionがスローされること
     */
    public function it_throws_authentication_exception_when_not_authenticated(): void
    {
        $this->expectException(AuthenticationException::class);
        $this->expectExceptionMessage('ログインしていません');

        $this->service->getAuthUser();
    }

    /**
     * @test
     * 未認証時にフォールバックユーザーを返さないこと
     */
    public function it_does_not_fallback_to_first_user(): void
    {
        // DBにユーザーが存在していても、未認証なら例外になる
        User::factory()->create();

        $this->expectException(AuthenticationException::class);

        $this->service->getAuthUser();
    }
}
