import type { CalendarResponse } from '@/__generated__/model';
import type { DayScheduleStatus } from '@/domain/schedule/types';
import { DAY_SCHEDULE_STATUS } from '@/domain/schedule/types';

export const toDayScheduleStatus = (dates: CalendarResponse): DayScheduleStatus[] => {
  return dates.map((isoDate) => {
    const date = new Date(`${isoDate}T00:00:00`);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return isWeekend ? DAY_SCHEDULE_STATUS.Off : DAY_SCHEDULE_STATUS.Working;
  });
};
