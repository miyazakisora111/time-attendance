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
     * {@inheritdoc}
     */
    protected string $schemaName = 'DashboardClockRequest';
}
