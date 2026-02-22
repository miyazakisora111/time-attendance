<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
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
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function email(): Email
    {
        return new Email($this->validated('email'));
    }
}
