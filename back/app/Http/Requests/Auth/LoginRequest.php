<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use App\Http\Requests\Generated\OpenApiGeneratedRules;
use App\ValueObjects\Email;

/**
 * ログインのリクエストクラス
 */
class LoginRequest extends BaseRequest
{
    /**
     * バリデーションルールを定義する。
     *
     * @return array<string, array<int, string>> バリデーションルール
     */
    public function rules(): array
    {
        return OpenApiGeneratedRules::schema('LoginRequest');
    }

    public function email(): Email
    {
        return new Email($this->validated('email'));
    }

    public function password(): string
    {
        return (string) $this->validated('password');
    }
}
