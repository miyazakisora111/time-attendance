import type { CalendarResponse } from '@/__generated__/model';
import type { DayScheduleStatus } from '@/domain/schedule/types';

export const toDayScheduleStatus = (response: CalendarResponse): DayScheduleStatus[] => {
  return response.days.map((day) => day.status as DayScheduleStatus);
};
