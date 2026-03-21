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
            'work_date' => ['required', 'string', 'date_format:Y-m-d'],
            'end_time' => ['sometimes', 'string', 'date_format:H:i'],
        ],
        'AttendanceIndexRequest' => [
            'from' => ['required', 'string', 'date_format:Y-m-d'],
            'to' => ['required', 'string', 'date_format:Y-m-d'],
        ],
        'AttendanceResponse' => [
            'user_id' => ['required', 'string'],
            'work_date' => ['required', 'string', 'date_format:Y-m-d'],
            'start_time' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
            'end_time' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
        ],
        'AttendanceStoreRequest' => [
            'work_date' => ['required', 'string', 'date_format:Y-m-d'],
            'start_time' => ['sometimes', 'string', 'date_format:H:i'],
            'end_time' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
            'note' => ['sometimes', 'nullable', 'string', 'max:500'],
        ],
        'AttendanceUpdateRequest' => [
            'start_time' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
            'end_time' => ['sometimes', 'nullable', 'string', 'date_format:H:i'],
            'note' => ['sometimes', 'nullable', 'string', 'max:500'],
        ],
        'CalendarDay' => [
            'date' => ['required', 'string', 'date_format:Y-m-d'],
            'label' => ['required', 'string'],
            'dayOfWeek' => ['required', 'string'],
            'status' => ['required', 'in:working,off,holiday,pending'],
            'shift' => ['sometimes', 'nullable', 'string'],
            'timeRange' => ['sometimes', 'nullable', 'string'],
            'location' => ['sometimes', 'nullable', 'string'],
            'note' => ['sometimes', 'nullable', 'string'],
            'isToday' => ['required', 'boolean'],
            'isHoliday' => ['required', 'boolean'],
        ],
        'CalendarIndexRequest' => [
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
        ],
        'CalendarResponse' => [
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'summary' => ['required', 'array'],
            'summary.totalWorkHours' => ['required', 'numeric'],
            'summary.targetHours' => ['required', 'numeric'],
            'summary.scheduledWorkDays' => ['required', 'integer'],
            'summary.overtimeHours' => ['required', 'numeric'],
            'summary.paidLeaveDays' => ['required', 'numeric'],
            'summary.remainingPaidLeaveDays' => ['required', 'numeric'],
            'days' => ['required', 'array'],
            'days.*' => ['required', 'array'],
            'days.*.date' => ['required', 'string', 'date_format:Y-m-d'],
            'days.*.label' => ['required', 'string'],
            'days.*.dayOfWeek' => ['required', 'string'],
            'days.*.status' => ['required', 'in:working,off,holiday,pending'],
            'days.*.shift' => ['sometimes', 'nullable', 'string'],
            'days.*.timeRange' => ['sometimes', 'nullable', 'string'],
            'days.*.location' => ['sometimes', 'nullable', 'string'],
            'days.*.note' => ['sometimes', 'nullable', 'string'],
            'days.*.isToday' => ['required', 'boolean'],
            'days.*.isHoliday' => ['required', 'boolean'],
        ],
        'CalendarSummary' => [
            'totalWorkHours' => ['required', 'numeric'],
            'targetHours' => ['required', 'numeric'],
            'scheduledWorkDays' => ['required', 'integer'],
            'overtimeHours' => ['required', 'numeric'],
            'paidLeaveDays' => ['required', 'numeric'],
            'remainingPaidLeaveDays' => ['required', 'numeric'],
        ],
        'DashboardClockRequest' => [
            'action' => ['required', 'in:in,out,break_start,break_end'],
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
            'recentRecords.*.status' => ['required', 'in:working,out,break'],
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
            'profile' => ['required', 'array'],
            'profile.name' => ['required', 'string'],
            'profile.email' => ['required', 'string', 'email'],
            'profile.department' => ['required', 'string'],
            'profile.role' => ['required', 'string'],
            'profile.employeeCode' => ['sometimes', 'string'],
            'notifications' => ['required', 'array'],
            'notifications.clockInReminder' => ['required', 'boolean'],
            'notifications.approvalNotification' => ['required', 'boolean'],
            'notifications.leaveReminder' => ['required', 'boolean'],
            'security' => ['required', 'array'],
            'security.twoFactorEnabled' => ['required', 'boolean'],
            'security.emailVerified' => ['required', 'boolean'],
            'security.lastLoginAt' => ['sometimes', 'nullable', 'string', 'date'],
            'security.passwordLastChangedAt' => ['sometimes', 'nullable', 'string', 'date'],
            'theme' => ['required', 'in:light,dark'],
            'language' => ['required', 'in:ja,en'],
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
            'profile' => ['required', 'array'],
            'profile.name' => ['required', 'string', 'min:1', 'max:120'],
            'profile.email' => ['required', 'string', 'max:255', 'email'],
            'notifications' => ['required', 'array'],
            'notifications.clockInReminder' => ['required', 'boolean'],
            'notifications.approvalNotification' => ['required', 'boolean'],
            'notifications.leaveReminder' => ['required', 'boolean'],
            'theme' => ['required', 'in:light,dark'],
            'language' => ['required', 'in:ja,en'],
        ],
        'UserResponse' => [
            'user' => ['required', 'array'],
            'user.id' => ['required', 'string'],
            'user.name' => ['required', 'string'],
            'user.email' => ['required', 'string', 'email'],
            'user.roles' => ['required', 'array'],
            'user.roles.*' => ['required', 'string'],
            'user.settings' => ['sometimes', 'nullable', 'array'],
            'user.settings.theme' => ['required', 'in:light,dark'],
            'user.settings.language' => ['required', 'in:ja,en'],
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
            'work_date' => '勤務日',
            'end_time' => '退勤時刻',
        ],
        'AttendanceIndexRequest' => [
            'from' => '開始日',
            'to' => '終了日',
        ],
        'AttendanceResponse' => [
            'user_id' => 'ユーザーID',
            'work_date' => '勤務日',
            'start_time' => '出勤時刻',
            'end_time' => '退勤時刻',
        ],
        'AttendanceStoreRequest' => [
            'work_date' => '勤務日',
            'start_time' => '出勤時刻',
            'end_time' => '退勤時刻',
            'note' => '備考',
        ],
        'AttendanceUpdateRequest' => [
            'start_time' => '出勤時刻',
            'end_time' => '退勤時刻',
            'note' => '備考',
        ],
        'CalendarDay' => [
            'date' => '日付',
            'label' => '日付表示',
            'dayOfWeek' => '曜日',
            'status' => 'スケジュール状態',
            'shift' => '勤務区分',
            'timeRange' => '勤務時間帯',
            'location' => '勤務場所',
            'note' => '備考',
            'isToday' => '今日フラグ',
            'isHoliday' => '休日フラグ',
        ],
        'CalendarIndexRequest' => [
            'year' => '年',
            'month' => '月',
        ],
        'CalendarResponse' => [
            'year' => '年',
            'month' => '月',
            'summary' => 'summary',
            'summary.totalWorkHours' => '総労働時間',
            'summary.targetHours' => '目標勤務時間',
            'summary.scheduledWorkDays' => '予定勤務日数',
            'summary.overtimeHours' => '残業時間',
            'summary.paidLeaveDays' => '有給取得日数',
            'summary.remainingPaidLeaveDays' => '残有給日数',
            'days' => 'days',
            'days.*' => 'days',
            'days.*.date' => '日付',
            'days.*.label' => '日付表示',
            'days.*.dayOfWeek' => '曜日',
            'days.*.status' => 'スケジュール状態',
            'days.*.shift' => '勤務区分',
            'days.*.timeRange' => '勤務時間帯',
            'days.*.location' => '勤務場所',
            'days.*.note' => '備考',
            'days.*.isToday' => '今日フラグ',
            'days.*.isHoliday' => '休日フラグ',
        ],
        'CalendarSummary' => [
            'totalWorkHours' => '総労働時間',
            'targetHours' => '目標勤務時間',
            'scheduledWorkDays' => '予定勤務日数',
            'overtimeHours' => '残業時間',
            'paidLeaveDays' => '有給取得日数',
            'remainingPaidLeaveDays' => '残有給日数',
        ],
        'DashboardClockRequest' => [
            'action' => '打刻アクション',
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
            'recentRecords.*.status' => 'スケジュール状態',
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
            'profile' => 'profile',
            'profile.name' => '氏名',
            'profile.email' => 'メールアドレス',
            'profile.department' => '部署',
            'profile.role' => '役職',
            'profile.employeeCode' => '社員番号',
            'notifications' => 'notifications',
            'notifications.clockInReminder' => '打刻忘れ通知',
            'notifications.approvalNotification' => '承認通知',
            'notifications.leaveReminder' => '休暇リマインド通知',
            'security' => 'security',
            'security.twoFactorEnabled' => '二要素認証設定',
            'security.emailVerified' => 'メール認証状態',
            'security.lastLoginAt' => '最終ログイン日時',
            'security.passwordLastChangedAt' => 'パスワード更新日時',
            'theme' => 'テーマ設定',
            'language' => '言語設定',
        ],
        'TeamMember' => [
            'id' => 'ユーザーID',
            'name' => '氏名',
            'role' => '役職',
            'department' => '部署',
            'status' => 'スケジュール状態',
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
            'members.*.status' => 'スケジュール状態',
            'members.*.clockInTime' => '出勤時刻',
            'members.*.email' => 'メールアドレス',
        ],
        'UpdateSettingsRequest' => [
            'profile' => 'profile',
            'profile.name' => '氏名',
            'profile.email' => 'メールアドレス',
            'notifications' => 'notifications',
            'notifications.clockInReminder' => '打刻忘れ通知',
            'notifications.approvalNotification' => '承認通知',
            'notifications.leaveReminder' => '休暇リマインド通知',
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
            'user.settings.theme' => 'テーマ設定',
            'user.settings.language' => '言語設定',
        ],
        'ValidationErrorResponse' => [
            'message' => 'メッセージ',
            'errors' => 'エラー詳細',
            'errors.*' => 'エラー詳細',
            'errors.*.*' => 'エラー詳細',
        ],
    ];
}
