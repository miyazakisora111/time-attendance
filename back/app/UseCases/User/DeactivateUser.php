<?php

declare(strict_types=1);

namespace App\UseCases\User;

use App\UseCases\BaseUseCase;
use App\Repositories\UserRepository;
use App\Enums\UserStatus;
use App\Exceptions\BusinessException;

/**
 * DeactivateUser UseCase
 * 
 * ユーザーを非アクティブ化するユースケース。
 */
class DeactivateUser extends BaseUseCase
{
    public function __construct(
        private readonly UserRepository $repository,
    ) {}

    /**
     * @throws BusinessException
     */
    public function execute(string $userId): void
    {
        $user = $this->repository->findById($userId);

        if (!$user) {
            throw new BusinessException("User not found: {$userId}", 404);
        }

        if (!$user->status->canDelete()) {
            throw new BusinessException('User cannot be deleted in current status');
        }

        // ユーザーを非アクティブ化
        $this->repository->update($userId, [
            'status' => UserStatus::INACTIVE->value,
        ]);
    }
}
