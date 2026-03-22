import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchCalendar } from '@/features/schedule/api/scheduleApi';
import { toScheduleMonthView } from '@/features/schedule/mappers/toScheduleMonthView';
import type { CalendarResponse } from '@/__generated__/model';
import type { ScheduleMonthData } from '@/domain/schedule/types';

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
 * 月次カレンダーを取得する。
 */
export const useScheduleCalendarQuery = (year: number, month: number) =>
  useQuery<CalendarResponse, Error, ScheduleMonthData>({
    queryKey: scheduleQueryKeys.calendar(year, month),
    queryFn: () => fetchCalendar(year, month),
    select: toScheduleMonthView,
  });
