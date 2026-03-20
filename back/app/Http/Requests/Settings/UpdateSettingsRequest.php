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
     * {@inheritdoc}
     */
    protected string $schemaName = 'UpdateSettingsRequest';
}
