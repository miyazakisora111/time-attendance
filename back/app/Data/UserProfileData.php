<?php

declare(strict_types=1);

namespace App\Data;

/**
 * ユーザープロフィールのデータ
 */
final class UserProfileData extends BaseData
{
    /**
     * コンストラクタ
     * 
     * @param string $id ユーザーID
     * @param string $name ユーザー名
     * @param string $email メールアドレス
     * @param array $roles 役割
     * @param mixed $settings 設定
     * @param bool $isAuthenticated 認証済みかどうか
     */
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $email,
        public readonly array $roles,
        public readonly ?array $settings,
        public readonly bool $isAuthenticated = true,
    ) {}
}
