<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * ユーザーステータスの列挙型
 */
enum UserStatus: string
{
    /**
     * 通常利用可能状態
     */
    case ACTIVE = 'active';

    /**
     * 手動停止または未有効化状態
     */
    case INACTIVE = 'inactive';

    /**
     * 規約違反などによる一時停止状態
     */
    case SUSPENDED = 'suspended';

    /**
     * 論理削除状態
     */
    case DELETED = 'deleted';

    /**
     * 表示用ラベルを返す
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'アクティブ',
            self::INACTIVE => '非アクティブ',
            self::SUSPENDED => '一時停止',
            self::DELETED => '削除済み',
        };
    }

    /**
     * 有効状態かどうか判定
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this === self::ACTIVE;
    }

    /**
     * 削除可能か判定
     *
     * @return bool
     */
    public function canDelete(): bool
    {
        return $this !== self::DELETED;
    }

    /**
     * 有効化可能か判定
     *
     * @return bool
     */
    public function canActivate(): bool
    {
        return $this !== self::ACTIVE;
    }
}
