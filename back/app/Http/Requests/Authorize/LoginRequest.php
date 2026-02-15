<?php

declare(strict_types=1);

namespace App\Http\Requests\Authorize;

use Illuminate\Foundation\Http\FormRequest;
use App\ValueObjects\Email;

/**
 * ログインのリクエストクラス
 */
class LoginRequest extends FormRequest
{
    /**
     * 認可判定
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

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
