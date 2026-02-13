<?php

declare(strict_types=1);

namespace App\Queries\User;

use App\Queries\BaseQuery;
use App\Repositories\UserRepository;
use App\DTO\User\UserData;
use App\Exceptions\BusinessException;

/**
 * UserDetailQuery
 * 
 * ユーザー詳細情報を取得するクエリ。
 */
class UserDetailQuery extends BaseQuery
{
    public function __construct(
        private readonly UserRepository $repository,
        private readonly string $userId,
    ) {}

    /**
     * @throws BusinessException
     */
    public function execute(): UserData
    {
        $user = $this->repository->findById($this->userId);

        if (!$user) {
            throw new BusinessException("User not found: {$this->userId}", 404);
        }

        return UserData::fromArray($user->toArray());
    }
}
