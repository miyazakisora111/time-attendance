import { useMemo, useState } from 'react';
import { type AttendanceStatus } from '@/domain/attendance/attendance';
import { useAttendanceClock } from '@/features/attendance/hooks/useAttendanceClock';
import { clockActionLabelMap } from '@/shared/presentation/attendance/clockAction';
import { type LastAction } from '@/features/attendance/ui/types';

/**
 * 勤怠画面の表示状態を管理するカスタムフック。
 */
export const useAttendance = () => {
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const {
    attendanceStatus,
    todayWorkedTime,
    isLoading,
    isError,
    isPending,
    handleAction,
  } = useAttendanceClock({
    onActionSuccess: ({ action, timeText }) => {
      setLastAction({ clockAction: action, time: timeText });
    },
  });

  const status = useMemo<AttendanceStatus>(() => {
    return attendanceStatus;
  }, [attendanceStatus]);

  // 最後の打刻アクション
  const lastActionView = useMemo(
    () => (lastAction ? { type: clockActionLabelMap[lastAction.clockAction], time: lastAction.time } : null),
    [lastAction]
  );

  return {
    status,
    lastAction: lastActionView,
    isLoading,
    isError,
    isPending,
    todayWorkedTime,
    handleAction,
  };
};