import {
  DAY_SCHEDULE_STATUS,
  type DaySchedule,
  type DayScheduleStatus,
} from '@/domain/schedule/types';
import { EMPTY_TIME_RANGE_TEXT } from '@/shared/presentation/format';

type ScheduleBadgeIntent = 'default' | 'danger' | 'outline' | 'warning';

interface ScheduleStatusView {
  border: string;
  bg: string;
  text: string;
  intent: ScheduleBadgeIntent;
  badgeLabel: string;
  shiftFallback: string;
}

const DEFAULT_WORK_SHIFT_LABEL = '通常勤務';
const DEFAULT_WORK_TIME_RANGE = '09:00 - 18:00';

const scheduleStatusViewMap: Record<DayScheduleStatus, ScheduleStatusView> = {
  working: {
    border: 'border-l-4 border-blue-500',
    bg: 'bg-white',
    text: 'text-gray-900',
    intent: 'default',
    badgeLabel: '出社',
    shiftFallback: '休み',
  },
  holiday: {
    border: 'border-l-4 border-red-500',
    bg: 'bg-red-50/30',
    text: 'text-red-700',
    intent: 'danger',
    badgeLabel: '休暇',
    shiftFallback: '休み',
  },
  off: {
    border: 'border-l-4 border-gray-300',
    bg: 'bg-gray-50/50',
    text: 'text-gray-400',
    intent: 'outline',
    badgeLabel: '公休',
    shiftFallback: '公休日',
  },
  pending: {
    border: 'border-l-4 border-amber-500',
    bg: 'bg-amber-50/30',
    text: 'text-amber-700',
    intent: 'warning',
    badgeLabel: '休暇',
    shiftFallback: '休み',
  },
};

export const toScheduleRows = (dates: string[], today = new Date()): DaySchedule[] => {
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;

  return dates.map((isoDate) => {
    const date = new Date(`${isoDate}T00:00:00`);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      status: isWeekend ? DAY_SCHEDULE_STATUS.Off : DAY_SCHEDULE_STATUS.Working,
      shift: isWeekend ? undefined : DEFAULT_WORK_SHIFT_LABEL,
      timeRange: isWeekend ? undefined : DEFAULT_WORK_TIME_RANGE,
      isToday: isoDate === todayText,
    };
  });
};

export const getScheduleStatusView = (status: DayScheduleStatus): ScheduleStatusView => {
  return scheduleStatusViewMap[status];
};

export const getScheduleShiftLabel = (day: DaySchedule): string => {
  return day.shift || getScheduleStatusView(day.status).shiftFallback;
};

export const getScheduleTimeRangeText = (timeRange?: string): string => {
  return timeRange || EMPTY_TIME_RANGE_TEXT;
};