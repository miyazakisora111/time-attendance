<?php

declare(strict_types=1);

namespace App\DTO\User;

use App\DTO\BaseDTO;
use App\ValueObjects\Email;
use App\Enums\UserStatus;

/**
 * ユーザーデータのDTOクラス
 */
final class UserData extends BaseDTO
{
    public function __construct(
        public string $id,
        public string $name,
        public Email $email,
        public UserStatus $status,
        public ?string $phone = null,
        public ?string $department = null,
        public ?string $position = null,
        public array $metadata = [],
        public ?\DateTimeImmutable $createdAt = null,
        public ?\DateTimeImmutable $updatedAt = null,
    ) {}
}
