<?php

declare(strict_types=1);

namespace App\UseCases\User;

use App\UseCases\BaseUseCase;
use App\Repositories\UserRepository;
use App\DTO\User\UserData;
use App\Exceptions\BusinessException;
use Illuminate\Support\Facades\Hash;

/**
 * UpdateUser UseCase
 * 
 * ユーザー情報を更新するユースケース。
 */
class UpdateUser extends BaseUseCase
{
    public function __construct(
        private readonly UserRepository $repository,
    ) {}

    /**
     * @throws BusinessException
     */
    public function execute(string $userId, array $data): UserData
    {
        $user = $this->repository->findById($userId);

        if (!$user) {
            throw new BusinessException("User not found: {$userId}", 404);
        }

        // 更新データを準備
        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['email'])) {
            $email = strtolower($data['email']);
            if ($email !== $user->email && $this->repository->exists(['email' => $email])) {
                throw new BusinessException('Email already exists');
            }
            $updateData['email'] = $email;
        }

        if (isset($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        if (isset($data['phone'])) {
            $updateData['phone'] = $data['phone'];
        }

        if (isset($data['department'])) {
            $updateData['department'] = $data['department'];
        }

        if (isset($data['position'])) {
            $updateData['position'] = $data['position'];
        }

        if (isset($data['status'])) {
            $updateData['status'] = $data['status'];
        }

        if (isset($data['metadata'])) {
            $updateData['metadata'] = array_merge($user->metadata ?? [], $data['metadata']);
        }

        // ユーザー情報を更新
        $this->repository->update($userId, $updateData);

        $updated = $this->repository->findById($userId);

        return UserData::fromArray($updated->toArray());
    }
}
