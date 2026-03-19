<?php

declare(strict_types=1);

namespace App\Http\Requests\Settings;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

/**
 * 設定更新リクエスト。
 */
final class UpdateSettingsRequest extends BaseRequest
{
    /**
     * バリデーションルールを返す。
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $userId = auth()->id();

        return [
            'profile' => ['required', 'array'],
            'profile.name' => ['required', 'string', 'max:120'],
            'profile.email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'notifications' => ['required', 'array'],
            'notifications.clockInReminder' => ['required', 'boolean'],
            'notifications.approvalNotification' => ['required', 'boolean'],
            'notifications.leaveReminder' => ['required', 'boolean'],
            'theme' => ['required', 'string', 'in:light,dark'],
            'language' => ['required', 'string', 'in:ja,en'],
        ];
    }
}
