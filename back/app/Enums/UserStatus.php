<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * ユーザーステータス列挙型
 * 
 * PHP 8.1以降の列挙型を使用して、
 * ユーザーの状態を厳密に管理します。
 */
enum UserStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case SUSPENDED = 'suspended';
    case DELETED = 'deleted';

    public function label(): string
    {
        return match($this) {
            self::ACTIVE => 'アクティブ',
            self::INACTIVE => '非アクティブ',
            self::SUSPENDED => '一時停止',
            self::DELETED => '削除済み',
        };
    }

    public function isActive(): bool
    {
        return $this === self::ACTIVE;
    }

    public function canDelete(): bool
    {
        return $this !== self::DELETED;
    }

    public function canActivate(): bool
    {
        return $this !== self::ACTIVE;
    }
}
