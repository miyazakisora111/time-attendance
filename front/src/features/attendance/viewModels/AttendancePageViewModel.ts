import { useState } from 'react';

import type { ClockAction } from '@/__generated__/enums';
import { formatJapaneseHourMinute } from '@/shared/utils/format';
import { getClockActionLabel } from '@/shared/presentation/attendance/clockAction';

import { useLatestAttendanceQuery } from '@/features/attendance/hooks/useAttendanceQueries';
import { useClock } from '@/features/attendance/hooks/useClock';
import { buildAttendancePageView } from '@/features/attendance/builders/buildAttendancePageView';

import type { WorkTimeCardView } from '@/features/attendance/viewModels/WorkTimeCardViewModel';
import { createWorkTimeCardView } from '@/features/attendance/viewModels/WorkTimeCardViewModel';
import type { ActionCardView } from '@/features/attendance/viewModels/ActionCardViewModel';
import type { ClockInCardView } from '@/features/attendance/viewModels/ClockInCardViewModel';
import { createClockInCardView } from '@/features/attendance/viewModels/ClockInCardViewModel';
import type { RecentActivityCardView } from '@/features/attendance/viewModels/RecentActivityCardViewModel';

export interface AttendancePageView {
    clockInCard: ClockInCardView;
    workTimeCard: WorkTimeCardView;
    actionCard: ActionCardView;
    recentActivity: RecentActivityCardView | null;
}

type AttendancePageViewModel = AttendancePageView & {
    isLoading: boolean;
    isError: boolean;
    handleAction: (action: ClockAction) => void;
};

export const initialAttendancePageView: AttendancePageView = {
    clockInCard: createClockInCardView('out', false),
    workTimeCard: createWorkTimeCardView(0, 0, 0),
    actionCard: { clockStatus: 'out', isPending: false },
    recentActivity: null,
};

/**
 * 勤怠画面専用の ViewModel。
 */
export const useAttendancePageViewModel = (): AttendancePageViewModel => {
    const { data, isLoading, isError } = useLatestAttendanceQuery();
    const { clock, isPending } = useClock();
    const [lastActionView, setLastAction] = useState<RecentActivityCardView | null>(null);
    const view = buildAttendancePageView({ response: data, defaultView: initialAttendancePageView, isLoading, isPending });

    const handleAction = (clockAction: ClockAction) => {
        clock(clockAction);
        setLastAction({
            clockAction,
            label: getClockActionLabel(clockAction),
            time: formatJapaneseHourMinute(new Date()),
        });
    };

    return {
        ...view,
        recentActivity: lastActionView ?? view.recentActivity,
        isLoading,
        isError,
        handleAction,
    };
};
