<?php

declare(strict_types=1);

namespace App\UseCases;

/**
 * BaseUseCase
 * 
 * すべてのユースケースの基底クラス。
 * ビジネスロジックの一貫性を保証します。
 */
abstract class BaseUseCase
{
    /**
     * ユースケースを実行
     */
    abstract public function execute(mixed ...$params): mixed;
}
