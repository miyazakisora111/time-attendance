<?php

declare(strict_types=1);

namespace App\DTO\User;

use App\ValueObjects\Email;
use App\Enums\UserStatus;

/**
 * UserData DTO (Data Transfer Object)
 * 
 * レイヤー間のデータ転送を型安全に行うための不変オブジェクト。
 * PHP 8.2のreadonly classを活用。
 */
final readonly class UserData
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

    /**
     * モデルの配列からDTOを作成
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? '',
            name: $data['name'] ?? '',
            email: $data['email'] instanceof Email ? $data['email'] : new Email($data['email'] ?? ''),
            status: $data['status'] instanceof UserStatus ? $data['status'] : UserStatus::from($data['status'] ?? 'active'),
            phone: $data['phone'] ?? null,
            department: $data['department'] ?? null,
            position: $data['position'] ?? null,
            metadata: $data['metadata'] ?? [],
            createdAt: $data['created_at'] instanceof \DateTimeImmutable 
                ? $data['created_at'] 
                : (isset($data['created_at']) ? new \DateTimeImmutable($data['created_at']) : null),
            updatedAt: $data['updated_at'] instanceof \DateTimeImmutable 
                ? $data['updated_at'] 
                : (isset($data['updated_at']) ? new \DateTimeImmutable($data['updated_at']) : null),
        );
    }

    /**
     * DTOを連想配列に変換
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email->value(),
            'status' => $this->status->value,
            'phone' => $this->phone,
            'department' => $this->department,
            'position' => $this->position,
            'metadata' => $this->metadata,
            'created_at' => $this->createdAt?->format(\DateTimeInterface::ATOM),
            'updated_at' => $this->updatedAt?->format(\DateTimeInterface::ATOM),
        ];
    }
}
