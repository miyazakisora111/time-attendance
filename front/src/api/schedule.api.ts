import { getSchedule } from '@/__generated__/schedule/schedule';
import type { CalendarResponse } from '@/__generated__/model';
import { call } from '@/lib/http/result';

const client = getSchedule();

/** 月次カレンダーを取得 */
export const fetchCalendar = (year: number, month: number) =>
  call<CalendarResponse>(() => client.getCalendar({ year, month }));
