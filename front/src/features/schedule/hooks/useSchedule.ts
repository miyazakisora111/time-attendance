import { useMemo, useState } from 'react';
import { useScheduleCalendarQuery } from '@/features/schedule/hooks/useScheduleQueries';
import type { ScheduleMonthData } from '@/domain/schedule/types';

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
 * スケジュール画面の月移動・フィルタ状態を管理する。
 */
export const useSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [showOnlyWorkingDays, setShowOnlyWorkingDays] = useState(false);

  const calendarQuery = useScheduleCalendarQuery(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
  );

  const scheduleData = calendarQuery.data ?? buildEmptyScheduleMonthData(currentMonth);

  const visibleSchedule = useMemo(
    () => (showOnlyWorkingDays ? scheduleData.days.filter((day) => day.status === 'working') : scheduleData.days),
    [scheduleData.days, showOnlyWorkingDays],
  );

  const nextMonth = () => {
    setCurrentMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));
  };

  const toggleWorkingDaysFilter = () => {
    setShowOnlyWorkingDays((previous) => !previous);
  };

  return {
    isLoading: calendarQuery.isLoading,
    isError: calendarQuery.isError,
    currentMonth,
    scheduleData,
    visibleSchedule,
    showOnlyWorkingDays,
    toggleWorkingDaysFilter,
    nextMonth,
    prevMonth,
  };
};
