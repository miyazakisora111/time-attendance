import type { AttendanceResponse } from '@/__generated__/model';

import type { AttendancePageView } from '@/features/attendance/ui/page/AttendancePage.types';
import { buildClockInCardView } from '@/features/attendance/assemblers/buildClockInCardView';
import { buildWorkTimeCardView } from '@/features/attendance/assemblers/buildWorkTimeCardView';

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
        clockInCard: buildClockInCardView(clockStatus, pending),
        workTimeCard: buildWorkTimeCardView(
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
