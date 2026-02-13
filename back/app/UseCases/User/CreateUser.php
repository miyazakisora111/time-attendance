<?php

declare(strict_types=1);

namespace App\UseCases\User;

use App\UseCases\BaseUseCase;
use App\Repositories\UserRepository;
use App\DTO\User\UserData;
use App\ValueObjects\Email;
use App\Enums\UserStatus;
use Illuminate\Support\Facades\Hash;
use App\Events\UserCreated;

/**
 * CreateUser UseCase
 * 
 * ユーザーを作成するユースケース。
 * ビジネスロジックを集約します。
 */
class CreateUser extends BaseUseCase
{
    public function __construct(
        private readonly UserRepository $repository,
    ) {}

    /**
     * @throws \App\Exceptions\DomainException
     */
    public function execute(array $data): UserData
    {
        // メールアドレスが既に存在するかチェック
        if ($this->repository->exists(['email' => strtolower($data['email'] ?? '')])) {
            throw new \App\Exceptions\DomainException('Email already exists');
        }

        // ユーザーデータを準備
        $userData = [
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'department' => $data['department'] ?? null,
            'position' => $data['position'] ?? null,
            'status' => UserStatus::ACTIVE->value,
            'metadata' => $data['metadata'] ?? [],
        ];

        // ユーザーを作成
        $user = $this->repository->create($userData);

        // イベントを発行
        event(new UserCreated($user));

        return UserData::fromArray($user->toArray());
    }
}
