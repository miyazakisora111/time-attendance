<?php

declare(strict_types=1);

namespace App\Http\Requests\Approval;

use App\Http\Requests\BaseRequest;

/**
 * 残業申請リクエスト。
 */
final class CreateOvertimeRequestRequest extends BaseRequest
{
    /**
     * {@inheritdoc}
     */
    protected string $schemaName = 'CreateOvertimeRequest';
}
