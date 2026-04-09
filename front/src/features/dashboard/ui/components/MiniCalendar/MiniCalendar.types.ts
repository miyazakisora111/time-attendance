import type { MiniCalendarDayView } from '@/features/dashboard/assemblers/buildMiniCalendarDays';

export interface MiniCalendarProps {
    monthLabel: string;
    days: MiniCalendarDayView[];
    isLoading: boolean;
    isError: boolean;
    nextMonth: () => void;
    prevMonth: () => void;
}
