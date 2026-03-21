import type { CalendarResponse } from '@/__generated__/model';
import type { ScheduleMonthData } from '@/domain/schedule/types';
import type { CalendarDayStatus } from '@/__generated__/enums';
import type { Mapper } from "@/shared/mapper/types";

export const toScheduleMonthView: Mapper<
  CalendarResponse,
  ScheduleMonthData
> = (response) => ({
  year: response.year,
  month: response.month,
  summary: {
    ...response.summary,
  },
  days: response.days.map((day) => ({
    ...day,
    isoDate: day.date,
    date: day.label,
    status: day.status as CalendarDayStatus,
    shift: day.shift ?? undefined,
    timeRange: day.timeRange ?? undefined,
    location: day.location ?? undefined,
    note: day.note ?? undefined,
  })),
});
