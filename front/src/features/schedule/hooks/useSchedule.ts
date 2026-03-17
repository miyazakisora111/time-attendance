import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSchedule } from '@/__generated__/schedule/schedule';
import { unwrapApiEnvelope } from '@/shared/http/unwrapApiEnvelope';
import { toScheduleRows } from '@/shared/presentation/schedule';

/** Schedule API Query Key。 */
const scheduleQueryKey = (year: number, month: number) => ['schedule', year, month] as const;

/**
 * カレンダー API を実行する。
 */
const fetchCalendar = async (year: number, month: number): Promise<string[]> => {
  const response = await getSchedule().getCalendarApi({ year, month });

  return unwrapApiEnvelope<string[]>(response);
};

/**
 * スケジュール画面の月移動状態を管理する。
 */
export const useSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const calendarQuery = useQuery({
    queryKey: scheduleQueryKey(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
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
