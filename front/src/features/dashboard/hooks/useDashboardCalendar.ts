import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchCalendar } from '@/api/schedule.api';

const SCOPE = 'dashboard-calendar' as const;
const scoped = makeScopedKeys(SCOPE);

export const dashboardCalendarQueryKeys = {
  month: (year: number, month: number) => scoped.nest(`month-${year}-${month}`),
} as const;

/**
 * ダッシュボード用のミニカレンダー状態を管理する。
 */
export const useDashboardCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const calendarQuery = useQuery({
    queryKey: dashboardCalendarQueryKeys.month(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
    ),
    queryFn: () => fetchCalendar(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
  });

  return {
    currentMonth,
    calendar: calendarQuery.data,
    isLoading: calendarQuery.isLoading,
    isError: calendarQuery.isError,
    nextMonth: () => setCurrentMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1)),
    prevMonth: () => setCurrentMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1)),
  };
};
