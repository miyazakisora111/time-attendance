import type { AttendanceResponse } from '@/__generated__/model';

import { createWorkTimeCardView } from '@/features/attendance/viewModels/WorkTimeCardViewModel';
import { createClockInCardView } from '@/features/attendance/viewModels/ClockInCardViewModel';
import type { AttendancePageView } from '@/features/attendance/viewModels/AttendancePageViewModel';

interface BuildAttendancePageViewArgs {
    response: AttendanceResponse | undefined;
    defaultView: AttendancePageView;
    isLoading: boolean;
    isPending: boolean;
}

export const buildAttendancePageView = ({
    response,
    defaultView,
    isLoading,
    isPending,
}: BuildAttendancePageViewArgs): AttendancePageView => {
    if (!response) {
        return {
            ...defaultView,
            clockInCard: {
                ...defaultView.clockInCard,
                isPending: isLoading,
            },
            actionCard: {
                ...defaultView.actionCard,
                isPending: isLoading,
            },
        };
    }

    const clockStatus = response.clockStatus ?? 'out';
    const pending = isLoading || isPending;

    return {
        clockInCard: createClockInCardView(clockStatus, pending),
        workTimeCard: createWorkTimeCardView(
            response.workedMinutes ?? 0,
            response.breakMinutes ?? 0,
            response.overtimeMinutes ?? 0,
        ),
        actionCard: {
            clockStatus,
            isPending: pending,
        },
        recentActivity: null,
    };
};
