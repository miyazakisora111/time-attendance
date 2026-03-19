import type { CalendarResponse } from '@/__generated__/model';
import type { DayScheduleStatus, ScheduleMonthData } from '@/domain/schedule/types';

/**
 * API レスポンスをスケジュール画面の表示モデルへ変換する。
 */
export const toScheduleMonthData = (response: CalendarResponse): ScheduleMonthData => ({
  year: response.year,
  month: response.month,
  summary: {
    totalWorkHours: response.summary.totalWorkHours,
    targetHours: response.summary.targetHours,
    scheduledWorkDays: response.summary.scheduledWorkDays,
    overtimeHours: response.summary.overtimeHours,
    paidLeaveDays: response.summary.paidLeaveDays,
    remainingPaidLeaveDays: response.summary.remainingPaidLeaveDays,
  },
  days: response.days.map((day) => ({
    isoDate: day.date,
    date: day.label,
    dayOfWeek: day.dayOfWeek,
    status: day.status as DayScheduleStatus,
    shift: day.shift ?? undefined,
    timeRange: day.timeRange ?? undefined,
    location: day.location ?? undefined,
    note: day.note ?? undefined,
    isToday: day.isToday,
    isHoliday: day.isHoliday,
  })),
});
