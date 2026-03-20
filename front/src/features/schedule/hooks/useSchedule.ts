import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CalendarResponse } from '@/__generated__/model';
import type { ScheduleMonthData } from '@/domain/schedule/types';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchCalendar } from '@/features/schedule/api/scheduleApi';
import { toScheduleMonthView } from '@/features/schedule/mappers/toScheduleMonthView';

/**
 * React Query キー。
 */
const SCOPE = 'schedule' as const;
const scoped = makeScopedKeys(SCOPE);
export const scheduleQueryKeys = {
  all: () => scoped.all(),
  calendar: (year: number, month: number) => scoped.nest(`calendar-${year}-${month}`),
} as const;

const buildEmptyScheduleMonthData = (currentMonth: Date): ScheduleMonthData => ({
  year: currentMonth.getFullYear(),
  month: currentMonth.getMonth() + 1,
  summary: {
    totalWorkHours: 0,
    targetHours: 0,
    scheduledWorkDays: 0,
    overtimeHours: 0,
    paidLeaveDays: 0,
    remainingPaidLeaveDays: 0,
  },
  days: [],
});

/**
 * スケジュール画面の月移動状態を管理する。
 */
export const useSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const calendarQuery = useQuery<CalendarResponse, Error, ScheduleMonthData>({
    queryKey: scheduleQueryKeys.calendar(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    queryFn: () => fetchCalendar(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    select: toScheduleMonthView,
  });

  /** 翌月へ移動する。 */
  const nextMonth = () => {
    setCurrentMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));
  };

  /** 前月へ移動する。 */
  const prevMonth = () => {
    setCurrentMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));
  };

  return {
    isLoading: calendarQuery.isLoading,
    isError: calendarQuery.isError,
    currentMonth,
    scheduleData: calendarQuery.data ?? buildEmptyScheduleMonthData(currentMonth),
    nextMonth,
    prevMonth,
  };
};
