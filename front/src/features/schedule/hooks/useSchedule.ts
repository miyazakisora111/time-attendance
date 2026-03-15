import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSchedule } from '@/api/__generated__/schedule/schedule';
import { DAY_SCHEDULE_STATUS, type DaySchedule } from '@/domain/enums/schedule';
import { unwrapApiEnvelope } from '@/shared/http/unwrapApiEnvelope';

/** Schedule API Query Key。 */
const scheduleQueryKey = (year: number, month: number) => ['schedule', year, month] as const;

/**
 * APIの日付文字列を画面表示用モデルへ変換する。
 */
const toScheduleRows = (dates: string[]): DaySchedule[] => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return dates.map((isoDate) => {
    const date = new Date(`${isoDate}T00:00:00`);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      status: isWeekend ? DAY_SCHEDULE_STATUS.Off : DAY_SCHEDULE_STATUS.Working,
      shift: isWeekend ? undefined : '通常勤務',
      timeRange: isWeekend ? undefined : '09:00 - 18:00',
      isToday: isoDate === today,
    };
  });
};

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
