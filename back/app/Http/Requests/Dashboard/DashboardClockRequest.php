<?php

declare(strict_types=1);

namespace App\Http\Requests\Dashboard;

use App\Http\Requests\BaseRequest;

/**
 * ダッシュボード打刻リクエスト
 */
final class DashboardClockRequest extends BaseRequest
{
    /**
     * バリデーションルールを返す。
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'action' => ['required', 'string', 'in:in,out,break_start,break_end'],
        ];
    }

    /**
     * バリデーション済みの打刻アクションを返す。
     *
     * @return string
     */
    public function action(): string
    {
        return (string) $this->validated('action');
    }
}
