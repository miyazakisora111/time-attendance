import { formatJapaneseYearMonth } from '@/shared/utils/format';

import { useDashboardCalendar } from '@/features/dashboard/hooks/useDashboardCalendar';
import { buildMiniCalendarDays } from '@/features/dashboard/assemblers/buildMiniCalendarDays';
import type { MiniCalendarProps } from '@/features/dashboard/ui/components/MiniCalendar/MiniCalendar.types';

/**
 * ミニカレンダーのHook。
 * カレンダーデータを取得し、View生成はlibに委譲する。
 */
export const useMiniCalendar = (): MiniCalendarProps => {
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
