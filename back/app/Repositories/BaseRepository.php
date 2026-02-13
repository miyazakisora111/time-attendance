<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * BaseRepository
 * 
 * すべてのリポジトリの基底クラス。
 * Database Abstraction Layer として機能します。
 */
abstract class BaseRepository
{
    protected Model $model;

    abstract public function getModel(): string;

    public function __construct()
    {
        $this->model = app($this->getModel());
    }

    /**
     * すべてのレコードを取得
     */
    public function all(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->all();
    }

    /**
     * IDでレコードを取得
     */
    public function findById(string|int $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * クエリビルダーを取得
     */
    public function query(): Builder
    {
        return $this->model->query();
    }

    /**
     * レコードを作成
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * レコードを更新
     */
    public function update(string|int $id, array $data): bool
    {
        $model = $this->findById($id);

        if (!$model) {
            return false;
        }

        return $model->update($data);
    }

    /**
     * レコードを削除
     */
    public function delete(string|int $id): bool
    {
        $model = $this->findById($id);

        if (!$model) {
            return false;
        }

        return $model->delete();
    }

    /**
     * ページネーション付きで取得
     */
    public function paginate(
        int $page = 1,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return $this->model->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * 条件でカウント
     */
    public function count(array $conditions = []): int
    {
        $query = $this->model->query();

        foreach ($conditions as $key => $value) {
            $query->where($key, $value);
        }

        return $query->count();
    }

    /**
     * 条件で存在確認
     */
    public function exists(array $conditions): bool
    {
        return $this->model->where($conditions)->exists();
    }
}
