// This file is auto-generated. Do not edit manually.
// Source: openapi/build/bundle.json + front/src/api/__generated__/zod.ts

import { z } from "zod";
import { components as generatedComponents } from "./zod";

export const validationSchemas = {
  AttendanceClockInRequest:
    generatedComponents.schemas.AttendanceClockInRequest.extend({
      work_date: z.string().trim().min(1, "work_dateは必須です。"),
      start_time: z.string().trim().min(1, "start_timeは必須です。"),
    }),
  AttendanceClockOutRequest:
    generatedComponents.schemas.AttendanceClockOutRequest.extend({
      end_time: z.string().trim().min(1, "end_timeは必須です。"),
    }),
  AttendanceResponse: generatedComponents.schemas.AttendanceResponse.extend({
    user_id: z.string().trim().min(1, "user_idは必須です。"),
    work_date: z.string().trim().min(1, "work_dateは必須です。"),
    start_time: z.string().trim().min(1, "start_timeは必須です。").nullable(),
    end_time: z.string().trim().nullable().optional(),
  }),
  DashboardClockRequest:
    generatedComponents.schemas.DashboardClockRequest.extend({
      action: z.enum(["in", "out", "break_start", "break_end"]),
    }),
  DashboardClockResponse:
    generatedComponents.schemas.DashboardClockResponse.extend({
      action: z.enum(["in", "out", "break_start", "break_end"]),
      timestamp: z.string().trim().min(1, "timestampは必須です。"),
      dashboard: z.object({
        user: z.object({
          id: z.string().trim().min(1, "idは必須です。"),
          name: z.string().trim().min(1, "nameは必須です。"),
        }),
        clockStatus: z.enum(["out", "in", "break"]),
        todayRecord: z.object({
          clockInTime: z
            .string()
            .trim()
            .min(1, "clockInTimeは必須です。")
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
            date: z.string().trim().min(1, "dateは必須です。"),
            day: z.string().trim().min(1, "dayは必須です。"),
            clockIn: z.string().trim().min(1, "clockInは必須です。").nullable(),
            clockOut: z
              .string()
              .trim()
              .min(1, "clockOutは必須です。")
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
      id: z.string().trim().min(1, "idは必須です。"),
      name: z.string().trim().min(1, "nameは必須です。"),
    }),
    clockStatus: z.enum(["out", "in", "break"]),
    todayRecord: z.object({
      clockInTime: z
        .string()
        .trim()
        .min(1, "clockInTimeは必須です。")
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
        date: z.string().trim().min(1, "dateは必須です。"),
        day: z.string().trim().min(1, "dayは必須です。"),
        clockIn: z.string().trim().min(1, "clockInは必須です。").nullable(),
        clockOut: z.string().trim().min(1, "clockOutは必須です。").nullable(),
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
      .min(1, "メールアドレスは必須です。")
      .email("メールアドレスの形式が正しくありません。")
      .max(255, "メールアドレスは255文字以内で入力してください。"),
    password: z
      .string()
      .trim()
      .min(1, "パスワードは必須です。")
      .min(8, "パスワードは8文字以上で入力してください。")
      .regex(/[A-Za-z]/, "パスワードに英字を1文字以上含めてください。")
      .regex(/\d/, "パスワードに数字を1文字以上含めてください。")
      .max(255, "パスワードは255文字以内で入力してください。")
      .regex(
        new RegExp("^(?=.*[A-Za-z])(?=.*\\d).+$"),
        "パスワードの形式が正しくありません。",
      ),
  }),
  LoginResponse: generatedComponents.schemas.LoginResponse.extend({
    token: z.string().trim().optional(),
  }),
  UserResponse: generatedComponents.schemas.UserResponse.extend({
    user: z.object({
      id: z.string().trim().min(1, "idは必須です。"),
      name: z.string().trim().min(1, "nameは必須です。"),
      email: z
        .string()
        .trim()
        .min(1, "メールアドレスは必須です。")
        .email("メールアドレスの形式が正しくありません。"),
      roles: z.array(z.string().trim().min(1, "itemは必須です。")),
      settings: z.record(z.string(), z.unknown()).nullable().optional(),
    }),
  }),
  ValidationErrorResponse:
    generatedComponents.schemas.ValidationErrorResponse.extend({
      message: z.string().trim().optional(),
      errors: z
        .record(
          z.string(),
          z.array(z.string().trim().min(1, "itemは必須です。")),
        )
        .optional(),
    }),
} as const;

export type ValidationSchemaName = keyof typeof validationSchemas;
