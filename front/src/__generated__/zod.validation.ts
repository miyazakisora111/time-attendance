// This file is auto-generated. Do not edit manually.
// Source: openapi/build/bundle.json + front/src/__generated__/zod.ts + field-labels.json

import { z } from 'zod';
import { components as generatedComponents } from './zod';
import labelsJson from './field-labels.json';

const labels = labelsJson as Record<string, string>;
const labelOf = (field: string): string => labels[field] ?? field;

export const validationSchemas = {
  AttendanceClockInRequest: generatedComponents.schemas.AttendanceClockInRequest.extend({
    work_date: z.string().trim().min(1, `${labelOf("work_date")}は必須です。`),
    start_time: z.string().trim().min(1, `${labelOf("start_time")}は必須です。`),
  }),
  AttendanceClockOutRequest: generatedComponents.schemas.AttendanceClockOutRequest.extend({
    work_date: z.string().trim().min(1, `${labelOf("work_date")}は必須です。`),
    end_time: z.string().trim().min(1, `${labelOf("end_time")}は必須です。`),
  }),
  AttendanceIndexRequest: generatedComponents.schemas.AttendanceIndexRequest.extend({
    from: z.string().trim().min(1, `${labelOf("from")}は必須です。`),
    to: z.string().trim().min(1, `${labelOf("to")}は必須です。`),
  }),
  AttendanceResponse: generatedComponents.schemas.AttendanceResponse.extend({
    user_id: z.string().trim().min(1, `${labelOf("user_id")}は必須です。`),
    work_date: z.string().trim().min(1, `${labelOf("work_date")}は必須です。`),
    start_time: z.string().trim().min(1, `${labelOf("start_time")}は必須です。`).nullable(),
    end_time: z.string().trim().nullable().optional(),
  }),
  AttendanceStoreRequest: generatedComponents.schemas.AttendanceStoreRequest.extend({
    work_date: z.string().trim().min(1, `${labelOf("work_date")}は必須です。`),
    start_time: z.string().trim().min(1, `${labelOf("start_time")}は必須です。`),
    end_time: z.string().trim().nullable().optional(),
    note: z.string().trim().max(500, `${labelOf("note")}は500文字以内で入力してください。`).nullable().optional(),
  }),
  AttendanceUpdateRequest: generatedComponents.schemas.AttendanceUpdateRequest.extend({
    start_time: z.string().trim().nullable().optional(),
    end_time: z.string().trim().nullable().optional(),
    note: z.string().trim().max(500, `${labelOf("note")}は500文字以内で入力してください。`).nullable().optional(),
  }),
  CalendarDay: generatedComponents.schemas.CalendarDay.extend({
    date: z.string().trim().min(1, `${labelOf("date")}は必須です。`),
    label: z.string().trim().min(1, `${labelOf("label")}は必須です。`),
    dayOfWeek: z.string().trim().min(1, `${labelOf("dayOfWeek")}は必須です。`),
    status: z.enum(['working', 'off', 'holiday', 'pending']),
    shift: z.string().trim().nullable().optional(),
    timeRange: z.string().trim().nullable().optional(),
    location: z.string().trim().nullable().optional(),
    note: z.string().trim().nullable().optional(),
    isToday: z.boolean(),
    isHoliday: z.boolean(),
  }),
  CalendarIndexRequest: generatedComponents.schemas.CalendarIndexRequest.extend({
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12),
  }),
  CalendarResponse: generatedComponents.schemas.CalendarResponse.extend({
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12),
    summary: z.object({
        totalWorkHours: z.number(),
        targetHours: z.number(),
        scheduledWorkDays: z.number().int(),
        overtimeHours: z.number(),
        paidLeaveDays: z.number(),
        remainingPaidLeaveDays: z.number(),
      }),
    days: z.array(z.object({
        date: z.string().trim().min(1, `${labelOf("date")}は必須です。`),
        label: z.string().trim().min(1, `${labelOf("label")}は必須です。`),
        dayOfWeek: z.string().trim().min(1, `${labelOf("dayOfWeek")}は必須です。`),
        status: z.enum(['working', 'off', 'holiday', 'pending']),
        shift: z.string().trim().nullable().optional(),
        timeRange: z.string().trim().nullable().optional(),
        location: z.string().trim().nullable().optional(),
        note: z.string().trim().nullable().optional(),
        isToday: z.boolean(),
        isHoliday: z.boolean(),
      })),
  }),
  CalendarSummary: generatedComponents.schemas.CalendarSummary.extend({
    totalWorkHours: z.number(),
    targetHours: z.number(),
    scheduledWorkDays: z.number().int(),
    overtimeHours: z.number(),
    paidLeaveDays: z.number(),
    remainingPaidLeaveDays: z.number(),
  }),
  DashboardClockRequest: generatedComponents.schemas.DashboardClockRequest.extend({
    action: z.enum(['in', 'out', 'break_start', 'break_end']),
  }),
  DashboardResponse: generatedComponents.schemas.DashboardResponse.extend({
    user: z.object({
        id: z.string().trim().min(1, `${labelOf("id")}は必須です。`),
        name: z.string().trim().min(1, `${labelOf("name")}は必須です。`),
      }),
    clockStatus: z.enum(['out', 'in', 'break']),
    todayRecord: z.object({
        clockInTime: z.string().trim().min(1, `${labelOf("clockInTime")}は必須です。`).nullable(),
        totalWorkedHours: z.number().nullable(),
      }),
    stats: z.object({
        totalHours: z.number(),
        targetHours: z.number(),
        workDays: z.number().int(),
        remainingDays: z.number().int(),
        avgHours: z.number(),
        avgHoursDiff: z.number(),
        overtimeHours: z.number(),
        overtimeDiff: z.number(),
      }),
    recentRecords: z.array(z.object({
        date: z.string().trim().min(1, `${labelOf("date")}は必須です。`),
        day: z.string().trim().min(1, `${labelOf("day")}は必須です。`),
        clockIn: z.string().trim().min(1, `${labelOf("clockIn")}は必須です。`).nullable(),
        clockOut: z.string().trim().min(1, `${labelOf("clockOut")}は必須です。`).nullable(),
        workHours: z.number().nullable(),
        status: z.enum(['working', 'out', 'break']),
      })),
    pendingOvertimeRequests: z.number().int(),
  }),
  ErrorResponse: generatedComponents.schemas.ErrorResponse.extend({
    message: z.string().trim().optional(),
  }),
  LoginRequest: generatedComponents.schemas.LoginRequest.extend({
    email: z.string().trim().min(1, `${labelOf("email")}は必須です。`).email(`${labelOf("email")}の形式が正しくありません。`).max(255, `${labelOf("email")}は255文字以内で入力してください。`),
    password: z.string().trim().min(1, `${labelOf("password")}は必須です。`).min(8, `${labelOf("password")}は8文字以上で入力してください。`).regex(/[A-Za-z]/, 'パスワードに英字を1文字以上含めてください。').regex(/\d/, 'パスワードに数字を1文字以上含めてください。').max(255, `${labelOf("password")}は255文字以内で入力してください。`).regex(new RegExp("^(?=.*[A-Za-z])(?=.*\\d).+$"), `${labelOf("password")}の形式が正しくありません。`),
  }),
  LoginResponse: generatedComponents.schemas.LoginResponse.extend({
    token: z.string().trim().optional(),
  }),
  SettingsResponse: generatedComponents.schemas.SettingsResponse.extend({
    profile: z.object({
        name: z.string().trim().min(1, `${labelOf("name")}は必須です。`),
        email: z.string().trim().min(1, `${labelOf("email")}は必須です。`).email(`${labelOf("email")}の形式が正しくありません。`),
        department: z.string().trim().min(1, `${labelOf("department")}は必須です。`),
        role: z.string().trim().min(1, `${labelOf("role")}は必須です。`),
        employeeCode: z.string().trim().min(1, `${labelOf("employeeCode")}は必須です。`),
      }),
    notifications: z.object({
        clockInReminder: z.boolean(),
        approvalNotification: z.boolean(),
        leaveReminder: z.boolean(),
      }),
    security: z.object({
        twoFactorEnabled: z.boolean(),
        emailVerified: z.boolean(),
        lastLoginAt: z.string().trim().nullable().optional(),
        passwordLastChangedAt: z.string().trim().nullable().optional(),
      }),
    theme: z.enum(['light', 'dark']),
    language: z.enum(['ja', 'en']),
  }),
  TeamMember: generatedComponents.schemas.TeamMember.extend({
    id: z.string().trim().min(1, `${labelOf("id")}は必須です。`),
    name: z.string().trim().min(1, `${labelOf("name")}は必須です。`),
    role: z.string().trim().min(1, `${labelOf("role")}は必須です。`),
    department: z.string().trim().min(1, `${labelOf("department")}は必須です。`),
    status: z.enum(['working', 'break', 'off', 'leave']),
    clockInTime: z.string().trim().nullable().optional(),
    email: z.string().trim().min(1, `${labelOf("email")}は必須です。`).email(`${labelOf("email")}の形式が正しくありません。`),
  }),
  TeamMembersResponse: generatedComponents.schemas.TeamMembersResponse.extend({
    members: z.array(z.object({
        id: z.string().trim().min(1, `${labelOf("id")}は必須です。`),
        name: z.string().trim().min(1, `${labelOf("name")}は必須です。`),
        role: z.string().trim().min(1, `${labelOf("role")}は必須です。`),
        department: z.string().trim().min(1, `${labelOf("department")}は必須です。`),
        status: z.enum(['working', 'break', 'off', 'leave']),
        clockInTime: z.string().trim().nullable().optional(),
        email: z.string().trim().min(1, `${labelOf("email")}は必須です。`).email(`${labelOf("email")}の形式が正しくありません。`),
      })),
  }),
  UpdateSettingsRequest: generatedComponents.schemas.UpdateSettingsRequest.extend({
    profile: z.object({
        name: z.string().trim().min(1, `${labelOf("name")}は必須です。`).max(120, `${labelOf("name")}は120文字以内で入力してください。`),
        email: z.string().trim().min(1, `${labelOf("email")}は必須です。`).email(`${labelOf("email")}の形式が正しくありません。`).max(255, `${labelOf("email")}は255文字以内で入力してください。`),
      }),
    notifications: z.object({
        clockInReminder: z.boolean(),
        approvalNotification: z.boolean(),
        leaveReminder: z.boolean(),
      }),
    theme: z.enum(['light', 'dark']),
    language: z.enum(['ja', 'en']),
  }),
  UserResponse: generatedComponents.schemas.UserResponse.extend({
    user: z.object({
        id: z.string().trim().min(1, `${labelOf("id")}は必須です。`),
        name: z.string().trim().min(1, `${labelOf("name")}は必須です。`),
        email: z.string().trim().min(1, `${labelOf("email")}は必須です。`).email(`${labelOf("email")}の形式が正しくありません。`),
        roles: z.array(z.string().trim().min(1, `${labelOf("item")}は必須です。`)),
        settings: z.object({
        theme: z.enum(['light', 'dark']).optional(),
        language: z.enum(['ja', 'en']).optional(),
      }).nullable().optional(),
      }),
  }),
  ValidationErrorResponse: generatedComponents.schemas.ValidationErrorResponse.extend({
    message: z.string().trim().optional(),
    errors: z.record(z.string(), z.array(z.string().trim().min(1, `${labelOf("item")}は必須です。`))).optional(),
  }),
} as const;

export type ValidationSchemaName = keyof typeof validationSchemas;
