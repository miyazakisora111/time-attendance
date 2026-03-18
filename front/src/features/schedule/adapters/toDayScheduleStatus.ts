import type { CalendarResponse } from '@/__generated__/model';
import type { DayScheduleStatus } from '@/domain/entities/schedule';
import { DAY_SCHEDULE_STATUS } from '@/domain/entities/schedule';

export const toDayScheduleStatus = (dates: CalendarResponse): DayScheduleStatus[] => {
  const today = new Date();
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return dates.map((isoDate) => {
    const date = new Date(`${isoDate}T00:00:00`);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return isWeekend ? DAY_SCHEDULE_STATUS.Off : DAY_SCHEDULE_STATUS.Working;
  });
};
