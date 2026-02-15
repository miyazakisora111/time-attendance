<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;
use App\Rules\StrongPassword;
use Illuminate\Validation\Rule;

/**
 * StoreRequest
 * 
 * ユーザー作成時のリクエストバリデーション。
 */
class StoreRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email'),
            ],
            'password' => [
                'required',
                'string',
                'min:12',
                'confirmed',
                new StrongPassword(),
            ],
            'phone' => [
                'nullable',
                'string',
                'regex:/^[0-9\-\+\s\(\)]+$/',
                'max:20',
            ],
            'department' => [
                'nullable',
                'string',
                'max:255',
            ],
            'position' => [
                'nullable',
                'string',
                'max:255',
            ],
            'metadata' => [
                'nullable',
                'array',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'ユーザー名は必須です',
            'name.min' => 'ユーザー名は2文字以上である必要があります',
            'email.required' => 'メールアドレスは必須です',
            'email.email' => '有効なメールアドレスを入力してください',
            'email.unique' => 'このメールアドレスはすでに登録されています',
            'password.required' => 'パスワードは必須です',
            'password.min' => 'パスワードは12文字以上である必要があります',
            'password.confirmed' => 'パスワード確認が一致しません',
        ];
    }
}
