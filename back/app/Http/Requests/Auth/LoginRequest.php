<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

/**
 * ログインのリクエストクラス
 */
class LoginRequest extends BaseRequest
{
    /**
     * OpenAPI スキーマ名
     *
     * @var string
     */
    protected string $schemaName = 'LoginRequest';
}
