<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;
use App\Rules\StrongPassword;
use Illuminate\Validation\Rule;

/**
 * UpdateRequest
 * 
 * ユーザー更新時のリクエストバリデーション。
 */
class UpdateRequest extends BaseRequest
{
    public function rules(): array
    {
        $userId = $this->route('user') ?? $this->route('id');

        return [
            'name' => [
                'sometimes',
                'string',
                'min:2',
                'max:255',
            ],
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => [
                'nullable',
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
            'status' => [
                'nullable',
                Rule::in('active', 'inactive', 'suspended'),
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
            'name.min' => 'ユーザー名は2文字以上である必要があります',
            'email.email' => '有効なメールアドレスを入力してください',
            'email.unique' => 'このメールアドレスはすでに登録されています',
            'password.min' => 'パスワードは12文字以上である必要があります',
            'password.confirmed' => 'パスワード確認が一致しません',
        ];
    }
}
