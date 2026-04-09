import { useState } from 'react';

import type { ClockAction } from '@/__generated__/enums';
import { formatJapaneseHourMinute } from '@/shared/utils/format';
import { getClockActionLabel } from '@/shared/presentation/attendance/clockAction';

import { useLatestAttendanceQuery } from '@/features/attendance/hooks/useAttendanceQueries';
import { useClock } from '@/features/attendance/hooks/useClock';
import { buildAttendancePageView } from '@/features/attendance/assemblers/buildAttendancePageView';
import { buildClockInCardView } from '@/features/attendance/assemblers/buildClockInCardView';
import { buildWorkTimeCardView } from '@/features/attendance/assemblers/buildWorkTimeCardView';
import type { AttendancePageProps, AttendancePageView } from '@/features/attendance/ui/page/AttendancePage.types';
import type { RecentActivityCardView } from '@/features/attendance/ui/components/RecentActivityCard/RecentActivityCard.types';

const initialView: AttendancePageView = {
    clockInCard: buildClockInCardView('out', false),
    workTimeCard: buildWorkTimeCardView(0, 0, 0),
    actionCard: { clockStatus: 'out', isPending: false },
    recentActivity: null,
};

export const useAttendancePage = (): AttendancePageProps => {
    const { data, isLoading, isError } = useLatestAttendanceQuery();
    const { clock, isPending } = useClock();
    const [lastActionView, setLastAction] = useState<RecentActivityCardView | null>(null);

    const view = buildAttendancePageView({
        response: data,
        defaultView: initialView,
        isLoading,
        isPending,
    });

    const handleAction = (action: ClockAction) => {
        clock(action);
        setLastAction({
            clockAction: action,
            label: getClockActionLabel(action),
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
