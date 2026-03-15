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
            'work_date' => ['required', 'string', 'date_format:Y-m-d'],
            'start_time' => ['sometimes', 'string', 'date_format:H:i'],
        ],
        'AttendanceClockOutRequest' => [
            'end_time' => ['sometimes', 'string', 'date_format:H:i'],
        ],
        'AttendanceResponse' => [
            'user_id' => ['required', 'string'],
            'work_date' => ['required', 'string', 'date_format:Y-m-d'],
            'start_time' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
            'end_time' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
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
            'dashboard.todayRecord.clockInTime' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
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
            'dashboard.recentRecords.*.date' => ['required', 'string', 'date_format:Y-m-d'],
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
            'todayRecord.clockInTime' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
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
            'recentRecords.*.date' => ['required', 'string', 'date_format:Y-m-d'],
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
        'SettingsResponse' => [
            'theme' => ['required', 'in:light,dark,system'],
            'language' => ['required', 'string'],
        ],
        'TeamMember' => [
            'id' => ['required', 'string'],
            'name' => ['required', 'string'],
            'role' => ['required', 'string'],
            'department' => ['required', 'string'],
            'status' => ['required', 'in:working,break,off,leave'],
            'clockInTime' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
            'email' => ['required', 'string', 'email'],
        ],
        'TeamMembersResponse' => [
            'members' => ['required', 'array'],
            'members.*' => ['required', 'array'],
            'members.*.id' => ['required', 'string'],
            'members.*.name' => ['required', 'string'],
            'members.*.role' => ['required', 'string'],
            'members.*.department' => ['required', 'string'],
            'members.*.status' => ['required', 'in:working,break,off,leave'],
            'members.*.clockInTime' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
            'members.*.email' => ['required', 'string', 'email'],
        ],
        'UpdateSettingsRequest' => [
            'theme' => ['required', 'in:light,dark,system'],
            'language' => ['required', 'string', 'min:1', 'max:32'],
        ],
        'UserResponse' => [
            'user' => ['required', 'array'],
            'user.id' => ['required', 'string'],
            'user.name' => ['required', 'string'],
            'user.email' => ['required', 'string', 'email'],
            'user.roles' => ['required', 'array'],
            'user.roles.*' => ['required', 'string'],
            'user.settings' => ['sometimes', 'nullable', 'array'],
            'user.settings.*' => ['sometimes', 'array'],
        ],
        'ValidationErrorResponse' => [
            'message' => ['sometimes', 'string'],
            'errors' => ['sometimes', 'array'],
            'errors.*' => ['sometimes', 'array'],
            'errors.*.*' => ['sometimes', 'string'],
        ],
    ];

    /**
     * @var array<string, array<string, string>>
     */
    private const SCHEMA_ATTRIBUTES = [
        'AttendanceClockInRequest' => [
            'work_date' => '勤務日',
            'start_time' => '出勤時刻',
        ],
        'AttendanceClockOutRequest' => [
            'end_time' => '退勤時刻',
        ],
        'AttendanceResponse' => [
            'user_id' => 'ユーザーID',
            'work_date' => '勤務日',
            'start_time' => '出勤時刻',
            'end_time' => '退勤時刻',
        ],
        'DashboardClockRequest' => [
            'action' => '打刻アクション',
        ],
        'DashboardClockResponse' => [
            'action' => '打刻アクション',
            'timestamp' => 'timestamp',
            'dashboard' => 'dashboard',
            'dashboard.user' => 'user',
            'dashboard.user.id' => 'ユーザーID',
            'dashboard.user.name' => '氏名',
            'dashboard.clockStatus' => '打刻状態',
            'dashboard.todayRecord' => 'todayRecord',
            'dashboard.todayRecord.clockInTime' => '出勤時刻',
            'dashboard.todayRecord.totalWorkedHours' => 'totalWorkedHours',
            'dashboard.stats' => 'stats',
            'dashboard.stats.totalHours' => '総勤務時間',
            'dashboard.stats.targetHours' => '目標勤務時間',
            'dashboard.stats.workDays' => '勤務日数',
            'dashboard.stats.remainingDays' => '残り日数',
            'dashboard.stats.avgHours' => '平均勤務時間',
            'dashboard.stats.avgHoursDiff' => '平均差分',
            'dashboard.stats.overtimeHours' => '残業時間',
            'dashboard.stats.overtimeDiff' => '残業差分',
            'dashboard.recentRecords' => '直近勤怠',
            'dashboard.recentRecords.*' => '直近勤怠',
            'dashboard.recentRecords.*.date' => '日付',
            'dashboard.recentRecords.*.day' => 'day',
            'dashboard.recentRecords.*.clockIn' => 'clockIn',
            'dashboard.recentRecords.*.clockOut' => 'clockOut',
            'dashboard.recentRecords.*.workHours' => 'workHours',
            'dashboard.recentRecords.*.status' => '状態',
            'dashboard.pendingOvertimeRequests' => '未処理残業申請数',
        ],
        'DashboardResponse' => [
            'user' => 'user',
            'user.id' => 'ユーザーID',
            'user.name' => '氏名',
            'clockStatus' => '打刻状態',
            'todayRecord' => 'todayRecord',
            'todayRecord.clockInTime' => '出勤時刻',
            'todayRecord.totalWorkedHours' => 'totalWorkedHours',
            'stats' => 'stats',
            'stats.totalHours' => '総勤務時間',
            'stats.targetHours' => '目標勤務時間',
            'stats.workDays' => '勤務日数',
            'stats.remainingDays' => '残り日数',
            'stats.avgHours' => '平均勤務時間',
            'stats.avgHoursDiff' => '平均差分',
            'stats.overtimeHours' => '残業時間',
            'stats.overtimeDiff' => '残業差分',
            'recentRecords' => '直近勤怠',
            'recentRecords.*' => '直近勤怠',
            'recentRecords.*.date' => '日付',
            'recentRecords.*.day' => 'day',
            'recentRecords.*.clockIn' => 'clockIn',
            'recentRecords.*.clockOut' => 'clockOut',
            'recentRecords.*.workHours' => 'workHours',
            'recentRecords.*.status' => '状態',
            'pendingOvertimeRequests' => '未処理残業申請数',
        ],
        'ErrorResponse' => [
            'message' => 'メッセージ',
        ],
        'LoginRequest' => [
            'email' => 'メールアドレス',
            'password' => 'パスワード',
        ],
        'LoginResponse' => [
            'token' => '認証トークン',
        ],
        'SettingsResponse' => [
            'theme' => 'テーマ設定',
            'language' => '言語設定',
        ],
        'TeamMember' => [
            'id' => 'ユーザーID',
            'name' => '氏名',
            'role' => '役職',
            'department' => '部署',
            'status' => '状態',
            'clockInTime' => '出勤時刻',
            'email' => 'メールアドレス',
        ],
        'TeamMembersResponse' => [
            'members' => 'メンバー一覧',
            'members.*' => 'メンバー一覧',
            'members.*.id' => 'ユーザーID',
            'members.*.name' => '氏名',
            'members.*.role' => '役職',
            'members.*.department' => '部署',
            'members.*.status' => '状態',
            'members.*.clockInTime' => '出勤時刻',
            'members.*.email' => 'メールアドレス',
        ],
        'UpdateSettingsRequest' => [
            'theme' => 'テーマ設定',
            'language' => '言語設定',
        ],
        'UserResponse' => [
            'user' => 'user',
            'user.id' => 'ユーザーID',
            'user.name' => '氏名',
            'user.email' => 'メールアドレス',
            'user.roles' => 'ロール一覧',
            'user.roles.*' => 'ロール一覧',
            'user.settings' => 'ユーザー設定',
            'user.settings.*' => 'ユーザー設定',
        ],
        'ValidationErrorResponse' => [
            'message' => 'メッセージ',
            'errors' => 'エラー詳細',
            'errors.*' => 'エラー詳細',
            'errors.*.*' => 'エラー詳細',
        ],
    ];
}
