<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Http\Resources\UserResource;
use App\UseCases\User\CreateUser;
use App\UseCases\User\UpdateUser;
use App\UseCases\User\DeactivateUser;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * UserController (API版)
 * 
 * RESTful APIエンドポイントを提供するコントローラー。
 * PHP 8.0のコンストラクタプロパティプロモーションを活用。
 */
class UserController extends BaseController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly CreateUser $createUserUseCase,
        private readonly UpdateUser $updateUserUseCase,
        private readonly DeactivateUser $deactivateUserUseCase,
    ) {}

    /**
     * ユーザー一覧を取得
     */
    public function index(Request $request): JsonResponse
    {
        $page = $request->integer('page', 1);
        $perPage = min($request->integer('per_page', 15), 100);
        $status = $request->string('status');

        $query = $this->userRepository->query();

        if ($status !== '' && $status !== null) {
            $query = $query->byStatus($status);
        }

        $users = $query->paginate($perPage, ['*'], 'page', $page);

        return $this->paginated($users);
    }

    /**
     * ユーザーを作成
     */
    public function store(StoreRequest $request): JsonResponse
    {
        try {
            $userData = $this->createUserUseCase->execute(
                $request->validated()
            );

            return $this->success(
                new UserResource($userData),
                'User created successfully',
                201
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * ユーザー詳細を取得
     */
    public function show(string $id): JsonResponse
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        return $this->success(new UserResource($user));
    }

    /**
     * ユーザー情報を更新
     */
    public function update(string $id, UpdateRequest $request): JsonResponse
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        try {
            $userData = $this->updateUserUseCase->execute(
                $id,
                $request->validated()
            );

            return $this->success(
                new UserResource($userData),
                'User updated successfully'
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * ユーザーを削除（論理削除）
     */
    public function destroy(string $id): JsonResponse
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        try {
            $this->deactivateUserUseCase->execute($id);

            return $this->success(null, 'User deactivated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
