import { formatJapaneseYearMonth } from '@/shared/utils/format';
import { useDashboardCalendar } from '@/features/dashboard/hooks/useDashboardCalendar';
import { buildMiniCalendarDays, type MiniCalendarDayView } from '@/features/dashboard/builders/buildMiniCalendarDays';

export interface MiniCalendarView {
    monthLabel: string;
    days: MiniCalendarDayView[];
    isLoading: boolean;
    isError: boolean;
}

type MiniCalendarViewModel = MiniCalendarView & {
    nextMonth: () => void;
    prevMonth: () => void;
};

/**
 * ミニカレンダー専用の ViewModel。
 */
export const useMiniCalendarViewModel = (): MiniCalendarViewModel => {
    const { currentMonth, calendar, isLoading, isError, nextMonth, prevMonth } = useDashboardCalendar();

    return {
        monthLabel: formatJapaneseYearMonth(currentMonth),
        days: buildMiniCalendarDays(calendar?.days ?? []),
        isLoading,
        isError,
        nextMonth,
        prevMonth,
    };
};
