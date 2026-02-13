<?php

declare(strict_types=1);

namespace App\Queries;

/**
 * BaseQuery
 * 
 * すべてのクエリの基底クラス。
 * CQRS パターンの Query 側を実装します。
 */
abstract class BaseQuery
{
    /**
     * クエリを実行
     */
    abstract public function execute(): mixed;
}
