<?php

declare(strict_types=1);

namespace App\__Generated__\Responses;

/**
 * ページネーション情報。一覧系HTTPレスポンスに必ず付与される。
 *
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: just openapi-php-dto
 */
final readonly class PageInfo
{
    public function __construct(
        public int $currentPage,
        public int $perPage,
        public int $totalItems,
        public int $totalPages,
    ) {}
}
