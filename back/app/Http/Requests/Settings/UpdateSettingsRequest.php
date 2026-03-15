<?php

declare(strict_types=1);

namespace App\Http\Requests\Settings;

use App\Http\Requests\BaseRequest;

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
        return [
            'theme' => ['required', 'string', 'in:light,dark,system'],
            'language' => ['required', 'string', 'max:32'],
        ];
    }
}
