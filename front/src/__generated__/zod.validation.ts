// This file is auto-generated. Do not edit manually.
// Source: openapi/build/bundle.json + front/src/__generated__/zod.ts + field-labels.json

import { z } from "zod";
import { components as generatedComponents } from "./zod";
import labelsJson from "./field-labels.json";

const labels = labelsJson as Record<string, string>;
const labelOf = (field: string): string => labels[field] ?? field;

export const validationSchemas = {
  AttendanceClockInRequest:
    generatedComponents.schemas.AttendanceClockInRequest.extend({
      work_date: z
        .string()
        .trim()
        .min(1, `${labelOf("work_date")}は必須です。`),
      start_time: z
        .string()
        .trim()
        .min(1, `${labelOf("start_time")}は必須です。`),
    }),
  AttendanceClockOutRequest:
    generatedComponents.schemas.AttendanceClockOutRequest.extend({
      end_time: z
        .string()
        .trim()
        .min(1, `${labelOf("end_time")}は必須です。`),
    }),
  AttendanceResponse: generatedComponents.schemas.AttendanceResponse.extend({
    user_id: z
      .string()
      .trim()
      .min(1, `${labelOf("user_id")}は必須です。`),
    work_date: z
      .string()
      .trim()
      .min(1, `${labelOf("work_date")}は必須です。`),
    start_time: z
      .string()
      .trim()
      .min(1, `${labelOf("start_time")}は必須です。`)
      .nullable(),
    end_time: z.string().trim().nullable().optional(),
  }),
  DashboardClockRequest:
    generatedComponents.schemas.DashboardClockRequest.extend({
      action: z.enum(["in", "out", "break_start", "break_end"]),
    }),
  DashboardClockResponse:
    generatedComponents.schemas.DashboardClockResponse.extend({
      action: z.enum(["in", "out", "break_start", "break_end"]),
      timestamp: z
        .string()
        .trim()
        .min(1, `${labelOf("timestamp")}は必須です。`),
      dashboard: z.object({
        user: z.object({
          id: z
            .string()
            .trim()
            .min(1, `${labelOf("id")}は必須です。`),
          name: z
            .string()
            .trim()
            .min(1, `${labelOf("name")}は必須です。`),
        }),
        clockStatus: z.enum(["out", "in", "break"]),
        todayRecord: z.object({
          clockInTime: z
            .string()
            .trim()
            .min(1, `${labelOf("clockInTime")}は必須です。`)
            .nullable(),
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
        recentRecords: z.array(
          z.object({
            date: z
              .string()
              .trim()
              .min(1, `${labelOf("date")}は必須です。`),
            day: z
              .string()
              .trim()
              .min(1, `${labelOf("day")}は必須です。`),
            clockIn: z
              .string()
              .trim()
              .min(1, `${labelOf("clockIn")}は必須です。`)
              .nullable(),
            clockOut: z
              .string()
              .trim()
              .min(1, `${labelOf("clockOut")}は必須です。`)
              .nullable(),
            workHours: z.number().nullable(),
            status: z.enum(["通常", "残業", "休日"]),
          }),
        ),
        pendingOvertimeRequests: z.number().int(),
      }),
    }),
  DashboardResponse: generatedComponents.schemas.DashboardResponse.extend({
    user: z.object({
      id: z
        .string()
        .trim()
        .min(1, `${labelOf("id")}は必須です。`),
      name: z
        .string()
        .trim()
        .min(1, `${labelOf("name")}は必須です。`),
    }),
    clockStatus: z.enum(["out", "in", "break"]),
    todayRecord: z.object({
      clockInTime: z
        .string()
        .trim()
        .min(1, `${labelOf("clockInTime")}は必須です。`)
        .nullable(),
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
    recentRecords: z.array(
      z.object({
        date: z
          .string()
          .trim()
          .min(1, `${labelOf("date")}は必須です。`),
        day: z
          .string()
          .trim()
          .min(1, `${labelOf("day")}は必須です。`),
        clockIn: z
          .string()
          .trim()
          .min(1, `${labelOf("clockIn")}は必須です。`)
          .nullable(),
        clockOut: z
          .string()
          .trim()
          .min(1, `${labelOf("clockOut")}は必須です。`)
          .nullable(),
        workHours: z.number().nullable(),
        status: z.enum(["通常", "残業", "休日"]),
      }),
    ),
    pendingOvertimeRequests: z.number().int(),
  }),
  ErrorResponse: generatedComponents.schemas.ErrorResponse.extend({
    message: z.string().trim().optional(),
  }),
  LoginRequest: generatedComponents.schemas.LoginRequest.extend({
    email: z
      .string()
      .trim()
      .min(1, `${labelOf("email")}は必須です。`)
      .email(`${labelOf("email")}の形式が正しくありません。`)
      .max(255, `${labelOf("email")}は255文字以内で入力してください。`),
    password: z
      .string()
      .trim()
      .min(1, `${labelOf("password")}は必須です。`)
      .min(8, `${labelOf("password")}は8文字以上で入力してください。`)
      .regex(/[A-Za-z]/, "パスワードに英字を1文字以上含めてください。")
      .regex(/\d/, "パスワードに数字を1文字以上含めてください。")
      .max(255, `${labelOf("password")}は255文字以内で入力してください。`)
      .regex(
        new RegExp("^(?=.*[A-Za-z])(?=.*\\d).+$"),
        `${labelOf("password")}の形式が正しくありません。`,
      ),
  }),
  LoginResponse: generatedComponents.schemas.LoginResponse.extend({
    token: z.string().trim().optional(),
  }),
  SettingsResponse: generatedComponents.schemas.SettingsResponse.extend({
    theme: z.enum(["light", "dark", "system"]),
    language: z
      .string()
      .trim()
      .min(1, `${labelOf("language")}は必須です。`),
  }),
  TeamMember: generatedComponents.schemas.TeamMember.extend({
    id: z
      .string()
      .trim()
      .min(1, `${labelOf("id")}は必須です。`),
    name: z
      .string()
      .trim()
      .min(1, `${labelOf("name")}は必須です。`),
    role: z
      .string()
      .trim()
      .min(1, `${labelOf("role")}は必須です。`),
    department: z
      .string()
      .trim()
      .min(1, `${labelOf("department")}は必須です。`),
    status: z.enum(["working", "break", "off", "leave"]),
    clockInTime: z.string().trim().nullable().optional(),
    email: z
      .string()
      .trim()
      .min(1, `${labelOf("email")}は必須です。`)
      .email(`${labelOf("email")}の形式が正しくありません。`),
  }),
  TeamMembersResponse: generatedComponents.schemas.TeamMembersResponse.extend({
    members: z.array(
      z.object({
        id: z
          .string()
          .trim()
          .min(1, `${labelOf("id")}は必須です。`),
        name: z
          .string()
          .trim()
          .min(1, `${labelOf("name")}は必須です。`),
        role: z
          .string()
          .trim()
          .min(1, `${labelOf("role")}は必須です。`),
        department: z
          .string()
          .trim()
          .min(1, `${labelOf("department")}は必須です。`),
        status: z.enum(["working", "break", "off", "leave"]),
        clockInTime: z.string().trim().nullable().optional(),
        email: z
          .string()
          .trim()
          .min(1, `${labelOf("email")}は必須です。`)
          .email(`${labelOf("email")}の形式が正しくありません。`),
      }),
    ),
  }),
  UpdateSettingsRequest:
    generatedComponents.schemas.UpdateSettingsRequest.extend({
      theme: z.enum(["light", "dark", "system"]),
      language: z
        .string()
        .trim()
        .min(1, `${labelOf("language")}は必須です。`)
        .max(32, `${labelOf("language")}は32文字以内で入力してください。`),
    }),
  UserResponse: generatedComponents.schemas.UserResponse.extend({
    user: z.object({
      id: z
        .string()
        .trim()
        .min(1, `${labelOf("id")}は必須です。`),
      name: z
        .string()
        .trim()
        .min(1, `${labelOf("name")}は必須です。`),
      email: z
        .string()
        .trim()
        .min(1, `${labelOf("email")}は必須です。`)
        .email(`${labelOf("email")}の形式が正しくありません。`),
      roles: z.array(
        z
          .string()
          .trim()
          .min(1, `${labelOf("item")}は必須です。`),
      ),
      settings: z.record(z.string(), z.unknown()).nullable().optional(),
    }),
  }),
  ValidationErrorResponse:
    generatedComponents.schemas.ValidationErrorResponse.extend({
      message: z.string().trim().optional(),
      errors: z
        .record(
          z.string(),
          z.array(
            z
              .string()
              .trim()
              .min(1, `${labelOf("item")}は必須です。`),
          ),
        )
        .optional(),
    }),
} as const;

export type ValidationSchemaName = keyof typeof validationSchemas;
