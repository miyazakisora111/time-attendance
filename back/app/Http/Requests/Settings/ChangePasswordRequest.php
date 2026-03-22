<?php

declare(strict_types=1);

namespace App\Http\Requests\Settings;

use App\Http\Requests\BaseRequest;

/**
 * パスワード変更リクエスト。
 */
final class ChangePasswordRequest extends BaseRequest
{
    /**
     * {@inheritdoc}
     */
    protected string $schemaName = 'ChangePasswordRequest';
}
