import { useState } from 'react';

import type { ClockAction, ClockStatus } from '@/__generated__/enums';
import { AttendanceStatus } from '@/__generated__/model/attendanceStatus';
import { clockStatusToAttendanceStatusMap } from '@/domain/attendance/attendance';
import { useLatestAttendanceQuery } from '@/features/attendance/hooks/useAttendanceQueries';
import { useClock } from '@/features/attendance/hooks/useClock';
import { formatJapaneseHourMinute } from '@/shared/utils/format';
import { getClockActionLabel } from '@/shared/presentation/attendance/clockAction';
import type { AttendanceView } from '@/features/attendance/types';
import { createEmptyAttendanceView } from '@/features/attendance/types';
import type { RecentActivityCardView } from '@/features/attendance/ui/components/RecentActivityCard/RecentActivityCard';

/**
 * 勤怠画面用カスタムフック
 */
export const useAttendance = (): AttendanceView & {
  attendanceStatus: AttendanceStatus;
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;
  handleAction: (action: ClockAction) => void;
  lastActionView: RecentActivityCardView | null;
} => {
  const { data, isLoading, isError } = useLatestAttendanceQuery();
  const { clock, isPending } = useClock();
  const [lastActionView, setLastAction] = useState<RecentActivityCardView | null>(null);
  const attendanceView: AttendanceView = data ?? createEmptyAttendanceView();
  const clockStatus: ClockStatus = attendanceView.clockStatus ?? 'out';

  const handleAction = (clockAction: ClockAction) => {
    clock(clockAction);

    setLastAction({
      clockAction: clockAction,
      label: getClockActionLabel(clockAction),
      time: formatJapaneseHourMinute(new Date()),
    });
  };

  return {
    ...attendanceView,
    attendanceStatus: clockStatusToAttendanceStatusMap[clockStatus],
    isLoading,
    isError,
    isPending,
    handleAction,
    lastActionView,
  };
};