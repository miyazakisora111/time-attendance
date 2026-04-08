import { useState, useCallback, useMemo } from 'react';

import type { ClockAction, ClockStatus } from '@/__generated__/enums';
import { formatJapaneseHourMinute } from '@/shared/utils/format';
import { getClockActionLabel } from '@/shared/presentation/attendance/clockAction';

import { useLatestAttendanceQuery } from '@/features/attendance/hooks/useAttendanceQueries';
import { useClock } from '@/features/attendance/hooks/useClock';
import { type AttendancePageView, attendancePageViewDefaults } from '@/features/attendance/ui/page/AttendancePageView';
import { createWorkTimeCardView } from '@/features/attendance/ui/components/WorkTimeCard/WorkTimeCardView';
import type { WorkTimeCardView } from '@/features/attendance/ui/components/WorkTimeCard/WorkTimeCardView';
import type { RecentActivityCardView } from '@/features/attendance/ui/components/RecentActivityCard/RecentActivityCardView';

/**
 * 勤怠ページ ViewModel
 *
 * 責務:
 * - hooks 経由で取得した勤怠データを各子コンポーネント用に組み立てる
 * - 打刻アクションのハンドリングと直近アクション表示の管理
 *
 * データフロー: hooks → mapper (select) → ViewModel → Component
 */
export const useAttendancePageViewModel = (): AttendancePageView => {
    const { data, isLoading, isError } = useLatestAttendanceQuery();
    const { clock, isPending } = useClock();
    const [lastActionView, setLastAction] = useState<RecentActivityCardView | null>(null);

    const attendanceView = data ?? attendancePageViewDefaults;
    const clockStatus: ClockStatus = attendanceView.clockStatus ?? 'out';
    const isActionPending = isLoading || isPending;

    const handleAction = useCallback((clockAction: ClockAction) => {
        clock(clockAction);
        setLastAction({
            clockAction,
            label: getClockActionLabel(clockAction),
            time: formatJapaneseHourMinute(new Date()),
        });
    }, [clock]);

    const workTimeCardView = useMemo(
        () => createWorkTimeCardView(
            attendanceView.totalWorkedMinutes,
            attendanceView.breakMinutes,
            attendanceView.overtimeMinutes,
        ),
        [attendanceView.totalWorkedMinutes, attendanceView.breakMinutes, attendanceView.overtimeMinutes],
    );

    return {
        clockStatus,
        isLoading,
        isError,
        isActionPending,
        workTimeCardView,
        lastActionView,
        handleAction,
    };
};
