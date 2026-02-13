<?php

declare(strict_types=1);

namespace App\Queries\User;

use App\Queries\BaseQuery;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * UserListQuery
 * 
 * ユーザー一覧を取得するクエリ。
 */
class UserListQuery extends BaseQuery
{
    public function __construct(
        private readonly UserRepository $repository,
        private readonly int $page = 1,
        private readonly int $perPage = 15,
        private readonly ?string $status = null,
        private readonly ?string $department = null,
        private readonly ?string $search = null,
    ) {}

    public function execute(): LengthAwarePaginator
    {
        $query = $this->repository->query();

        if ($this->status !== null) {
            $query->where('status', $this->status);
        }

        if ($this->department !== null) {
            $query->where('department', $this->department);
        }

        if ($this->search !== null) {
            $query->where(function ($q) {
                $q->where('name', 'like', "%{$this->search}%")
                    ->orWhere('email', 'like', "%{$this->search}%");
            });
        }

        return $query->paginate($this->perPage, ['*'], 'page', $this->page);
    }
}
