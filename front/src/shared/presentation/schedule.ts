import type { CalendarDayStatus } from '@/__generated__/enums';

type ScheduleBadgeIntent = 'default' | 'danger' | 'outline' | 'warning';

export interface ScheduleStatusView {
  border: string;
  bg: string;
  text: string;
  intent: ScheduleBadgeIntent;
  badgeLabel: string;
  shiftFallback: string;
}

const scheduleStatusViewMap: Record<CalendarDayStatus, ScheduleStatusView> = {
  working: {
    border: 'border-l-4 border-blue-500',
    bg: 'bg-white',
    text: 'text-gray-900',
    intent: 'default',
    badgeLabel: '出社',
    shiftFallback: '通常勤務',
  },
  holiday: {
    border: 'border-l-4 border-red-500',
    bg: 'bg-red-50/30',
    text: 'text-red-700',
    intent: 'danger',
    badgeLabel: '祝日',
    shiftFallback: '祝日',
  },
  off: {
    border: 'border-l-4 border-gray-300',
    bg: 'bg-gray-50/50',
    text: 'text-gray-500',
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
    shiftFallback: '有給休暇',
  },
};

export const getScheduleStatusView = (status: CalendarDayStatus): ScheduleStatusView => {
  return scheduleStatusViewMap[status];
};
