import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchCalendar } from '@/features/schedule/api/scheduleApi';
import { toScheduleRows } from '@/shared/presentation/schedule';
import { QUERY_CONFIG } from '@/config/api';

/**
 * React Query キー。
 */
const SCOPE = 'schedule' as const;
const scoped = makeScopedKeys(SCOPE);
export const scheduleQueryKeys = {
  all: () => scoped.all(),
  calendar: (year: number, month: number) => scoped.nest(`calendar-${year}-${month}`),
} as const;

/**
 * スケジュール画面の月移動状態を管理する。
 */
export const useSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const calendarQuery = useQuery({
    queryKey: scheduleQueryKeys.calendar(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    queryFn: () => fetchCalendar(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
  });

  const schedule = useMemo(
    () => toScheduleRows(calendarQuery.data ?? []),
    [calendarQuery.data],
  );

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
    schedule,
    nextMonth,
    prevMonth,
  };
};
