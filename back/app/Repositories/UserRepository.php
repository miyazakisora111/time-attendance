<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * UserRepository
 * 
 * ユーザーモデル専用のリポジトリ。
 * Userモデルへのすべてのアクセスを一元化します。
 */
class UserRepository extends BaseRepository
{
    public function getModel(): string
    {
        return User::class;
    }

    /**
     * メールアドレスでユーザーを検索
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->byEmail($email)->first();
    }

    /**
     * ステータスでユーザーを検索
     */
    public function findByStatus(UserStatus|string $status, int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        $statusValue = $status instanceof UserStatus ? $status->value : $status;
        return $this->model->where('status', $statusValue)->limit($limit)->get();
    }

    /**
     * 複数のメールアドレスでユーザーを検索
     */
    public function findByEmails(array $emails): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->whereIn('email', array_map('strtolower', $emails))->get();
    }

    /**
     * アクティブなユーザーを取得
     */
    public function getActiveUsers(int $page = 1, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->active()->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * 部門でユーザーを検索
     */
    public function findByDepartment(string $department): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->where('department', $department)->get();
    }

    /**
     * ユーザーをクエリビルダーで取得（ステータスでフィルタリング可能）
     */
    public function query(): Builder
    {
        return $this->model->query();
    }

    /**
     * 最後のログイン日時が古いユーザーを取得
     */
    public function getInactiveUsers(\DateTimeInterface $before, int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model
            ->where('last_login_at', '<', $before)
            ->orWhereNull('last_login_at')
            ->limit($limit)
            ->get();
    }

    /**
     * ユーザーをメタデータで検索
     */
    public function findByMetadata(string $key, mixed $value): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model
            ->where('metadata->' . $key, $value)
            ->get();
    }
}
