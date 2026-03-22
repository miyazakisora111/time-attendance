<?php

declare(strict_types=1);

namespace App\Http\Requests\Approval;

use App\Http\Requests\BaseRequest;

/**
 * 有給休暇申請リクエスト。
 */
final class CreatePaidLeaveRequestRequest extends BaseRequest
{
    /**
     * {@inheritdoc}
     */
    protected string $schemaName = 'CreatePaidLeaveRequest';
}
