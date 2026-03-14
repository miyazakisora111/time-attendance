<?php

declare(strict_types=1);

namespace App\Http\Requests\Generated;

/**
 * OpenAPI から自動生成されたバリデーションルール。
 * 直接編集しないこと。
 */
final class OpenApiGeneratedRules
{
    /**
     * @return array<string, array<int, string>>
     */
    public static function schema(string $schema): array
    {
        return self::SCHEMA_RULES[$schema] ?? [];
    }

    /**
     * @return array<string, string>
     */
    public static function schemaAttributes(string $schema): array
    {
        return self::SCHEMA_ATTRIBUTES[$schema] ?? [];
    }

    /**
     * @var array<string, array<string, array<int, string>>>
     */
    private const SCHEMA_RULES = [
        'AttendanceClockInRequest' => [
            'work_date' => ['required', 'string'],
            'start_time' => ['required', 'string'],
        ],
        'AttendanceClockOutRequest' => [
            'end_time' => ['required', 'string'],
        ],
        'AttendanceResponse' => [
            'user_id' => ['required', 'string'],
            'work_date' => ['required', 'string'],
            'start_time' => ['required', 'nullable', 'string'],
            'end_time' => ['sometimes', 'nullable', 'string'],
        ],
        'DashboardClockRequest' => [
            'action' => ['required', 'in:in,out,break_start,break_end'],
        ],
        'DashboardClockResponse' => [
            'action' => ['required', 'in:in,out,break_start,break_end'],
            'timestamp' => ['required', 'string'],
            'dashboard' => ['required', 'array'],
            'dashboard.user' => ['required', 'array'],
            'dashboard.user.id' => ['required', 'string'],
            'dashboard.user.name' => ['required', 'string'],
            'dashboard.clockStatus' => ['required', 'in:out,in,break'],
            'dashboard.todayRecord' => ['required', 'array'],
            'dashboard.todayRecord.clockInTime' => ['required', 'nullable', 'string'],
            'dashboard.todayRecord.totalWorkedHours' => ['required', 'nullable', 'numeric'],
            'dashboard.stats' => ['required', 'array'],
            'dashboard.stats.totalHours' => ['required', 'numeric'],
            'dashboard.stats.targetHours' => ['required', 'numeric'],
            'dashboard.stats.workDays' => ['required', 'integer'],
            'dashboard.stats.remainingDays' => ['required', 'integer'],
            'dashboard.stats.avgHours' => ['required', 'numeric'],
            'dashboard.stats.avgHoursDiff' => ['required', 'numeric'],
            'dashboard.stats.overtimeHours' => ['required', 'numeric'],
            'dashboard.stats.overtimeDiff' => ['required', 'numeric'],
            'dashboard.recentRecords' => ['required', 'array'],
            'dashboard.recentRecords.*' => ['required', 'array'],
            'dashboard.recentRecords.*.date' => ['required', 'string'],
            'dashboard.recentRecords.*.day' => ['required', 'string'],
            'dashboard.recentRecords.*.clockIn' => ['required', 'nullable', 'string'],
            'dashboard.recentRecords.*.clockOut' => ['required', 'nullable', 'string'],
            'dashboard.recentRecords.*.workHours' => ['required', 'nullable', 'numeric'],
            'dashboard.recentRecords.*.status' => ['required', 'in:通常,残業,休日'],
            'dashboard.pendingOvertimeRequests' => ['required', 'integer'],
        ],
        'DashboardResponse' => [
            'user' => ['required', 'array'],
            'user.id' => ['required', 'string'],
            'user.name' => ['required', 'string'],
            'clockStatus' => ['required', 'in:out,in,break'],
            'todayRecord' => ['required', 'array'],
            'todayRecord.clockInTime' => ['required', 'nullable', 'string'],
            'todayRecord.totalWorkedHours' => ['required', 'nullable', 'numeric'],
            'stats' => ['required', 'array'],
            'stats.totalHours' => ['required', 'numeric'],
            'stats.targetHours' => ['required', 'numeric'],
            'stats.workDays' => ['required', 'integer'],
            'stats.remainingDays' => ['required', 'integer'],
            'stats.avgHours' => ['required', 'numeric'],
            'stats.avgHoursDiff' => ['required', 'numeric'],
            'stats.overtimeHours' => ['required', 'numeric'],
            'stats.overtimeDiff' => ['required', 'numeric'],
            'recentRecords' => ['required', 'array'],
            'recentRecords.*' => ['required', 'array'],
            'recentRecords.*.date' => ['required', 'string'],
            'recentRecords.*.day' => ['required', 'string'],
            'recentRecords.*.clockIn' => ['required', 'nullable', 'string'],
            'recentRecords.*.clockOut' => ['required', 'nullable', 'string'],
            'recentRecords.*.workHours' => ['required', 'nullable', 'numeric'],
            'recentRecords.*.status' => ['required', 'in:通常,残業,休日'],
            'pendingOvertimeRequests' => ['required', 'integer'],
        ],
        'ErrorResponse' => [
            'message' => ['sometimes', 'string'],
        ],
        'LoginRequest' => [
            'email' => ['required', 'string', 'min:1', 'max:255', 'email'],
            'password' => ['required', 'string', 'min:8', 'max:255', 'regex:/^(?=.*[A-Za-z])(?=.*\\d).+$/', 'regex:/[A-Za-z]/', 'regex:/\\d/'],
        ],
        'LoginResponse' => [
            'token' => ['sometimes', 'string'],
        ],
        'UserResponse' => [
            'user' => ['required', 'array'],
            'user.id' => ['required', 'string'],
            'user.name' => ['required', 'string'],
            'user.email' => ['required', 'string', 'email'],
            'user.roles' => ['required', 'array'],
            'user.roles.*' => ['required', 'string'],
            'user.settings' => ['sometimes', 'nullable', 'array'],
            'user.settings.*' => ['required'],
        ],
        'ValidationErrorResponse' => [
            'message' => ['sometimes', 'string'],
            'errors' => ['sometimes', 'array'],
            'errors.*' => ['required', 'array'],
            'errors.*.*' => ['required', 'string'],
        ],
    ];

    /**
     * @var array<string, array<string, string>>
     */
    private const SCHEMA_ATTRIBUTES = [
        'AttendanceClockInRequest' => [
            'work_date' => 'work_date',
            'start_time' => 'start_time',
        ],
        'AttendanceClockOutRequest' => [
            'end_time' => 'end_time',
        ],
        'AttendanceResponse' => [
            'user_id' => 'user_id',
            'work_date' => 'work_date',
            'start_time' => 'start_time',
            'end_time' => 'end_time',
        ],
        'DashboardClockRequest' => [
            'action' => 'action',
        ],
        'DashboardClockResponse' => [
            'action' => 'action',
            'timestamp' => 'timestamp',
            'dashboard' => 'dashboard',
            'dashboard.user' => 'user',
            'dashboard.user.id' => 'id',
            'dashboard.user.name' => 'name',
            'dashboard.clockStatus' => 'clockStatus',
            'dashboard.todayRecord' => 'todayRecord',
            'dashboard.todayRecord.clockInTime' => 'clockInTime',
            'dashboard.todayRecord.totalWorkedHours' => 'totalWorkedHours',
            'dashboard.stats' => 'stats',
            'dashboard.stats.totalHours' => 'totalHours',
            'dashboard.stats.targetHours' => 'targetHours',
            'dashboard.stats.workDays' => 'workDays',
            'dashboard.stats.remainingDays' => 'remainingDays',
            'dashboard.stats.avgHours' => 'avgHours',
            'dashboard.stats.avgHoursDiff' => 'avgHoursDiff',
            'dashboard.stats.overtimeHours' => 'overtimeHours',
            'dashboard.stats.overtimeDiff' => 'overtimeDiff',
            'dashboard.recentRecords' => 'recentRecords',
            'dashboard.recentRecords.*' => 'recentRecords',
            'dashboard.recentRecords.*.date' => 'date',
            'dashboard.recentRecords.*.day' => 'day',
            'dashboard.recentRecords.*.clockIn' => 'clockIn',
            'dashboard.recentRecords.*.clockOut' => 'clockOut',
            'dashboard.recentRecords.*.workHours' => 'workHours',
            'dashboard.recentRecords.*.status' => 'status',
            'dashboard.pendingOvertimeRequests' => 'pendingOvertimeRequests',
        ],
        'DashboardResponse' => [
            'user' => 'user',
            'user.id' => 'id',
            'user.name' => 'name',
            'clockStatus' => 'clockStatus',
            'todayRecord' => 'todayRecord',
            'todayRecord.clockInTime' => 'clockInTime',
            'todayRecord.totalWorkedHours' => 'totalWorkedHours',
            'stats' => 'stats',
            'stats.totalHours' => 'totalHours',
            'stats.targetHours' => 'targetHours',
            'stats.workDays' => 'workDays',
            'stats.remainingDays' => 'remainingDays',
            'stats.avgHours' => 'avgHours',
            'stats.avgHoursDiff' => 'avgHoursDiff',
            'stats.overtimeHours' => 'overtimeHours',
            'stats.overtimeDiff' => 'overtimeDiff',
            'recentRecords' => 'recentRecords',
            'recentRecords.*' => 'recentRecords',
            'recentRecords.*.date' => 'date',
            'recentRecords.*.day' => 'day',
            'recentRecords.*.clockIn' => 'clockIn',
            'recentRecords.*.clockOut' => 'clockOut',
            'recentRecords.*.workHours' => 'workHours',
            'recentRecords.*.status' => 'status',
            'pendingOvertimeRequests' => 'pendingOvertimeRequests',
        ],
        'ErrorResponse' => [
            'message' => 'message',
        ],
        'LoginRequest' => [
            'email' => 'メールアドレス',
            'password' => 'パスワード',
        ],
        'LoginResponse' => [
            'token' => 'token',
        ],
        'UserResponse' => [
            'user' => 'user',
            'user.id' => 'id',
            'user.name' => 'name',
            'user.email' => 'メールアドレス',
            'user.roles' => 'roles',
            'user.roles.*' => 'roles',
            'user.settings' => 'settings',
            'user.settings.*' => 'settings',
        ],
        'ValidationErrorResponse' => [
            'message' => 'message',
            'errors' => 'errors',
            'errors.*' => 'errors',
            'errors.*.*' => 'errors',
        ],
    ];
}
