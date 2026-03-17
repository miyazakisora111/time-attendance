import { toast as sonner } from 'sonner';
import { useMemo, useState } from 'react';
import type { AttendanceStatus, ClockStatus, LastAction } from '@/domain/time-attendance/attendance';
import type { ClockAction } from '@/domain/time-attendance/clock-action';
import { useCurrentTime } from '@/features/attendance/hooks/useCurrentTime';
import { useAttendanceClockAction, useAttendanceDashboardData } from '@/features/attendance/hooks/useAttendanceData';
import {
  EMPTY_TIME_TEXT,
  formatJapaneseHourMinute,
  formatWorkedHours,
} from '@/shared/presentation/format';
import { getActionLabel } from '@/shared/presentation/action-label';
import {
  mapClockStatusToAttendanceStatus,
  toLastActionView,
} from '@/shared/presentation/time-attendance';

/**
 * 勤怠画面の表示状態を管理する hook。
 *
 * 打刻状態の取得・打刻実行・表示用データ変換を担当する。
 */
export const useAttendance = () => {
  const currentTime = useCurrentTime();
  const { data, isLoading, isError } = useAttendanceDashboardData();
  const { mutate: clockAction, isPending } = useAttendanceClockAction();
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  const status = useMemo<AttendanceStatus>(() => {
    const rawStatus = (data?.clockStatus ?? 'out') as ClockStatus;
    return mapClockStatusToAttendanceStatus(rawStatus);
  }, [data?.clockStatus]);

  const todayWorkedTime = useMemo(() => {
    return formatWorkedHours(data?.todayRecord?.totalWorkedHours);
  }, [data?.todayRecord?.totalWorkedHours]);

  const breakTime = EMPTY_TIME_TEXT;

  const lastActionView = useMemo(() => {
    if (!lastAction) return null;
    return toLastActionView(lastAction);
  }, [lastAction]);

  /**
   * 画面の打刻操作を API アクションへ変換して実行する。
   *
   * @param action 実行する打刻アクション
   */
  const handleAction = (action: ClockAction) => {
    const nowText = formatJapaneseHourMinute(new Date());
    const label = getActionLabel(action);

    clockAction(action, {
      onSuccess: () => {
        setLastAction({ action, time: nowText });
        sonner.success(`${label}しました (${nowText})`, {
          description: '本日の勤務データに記録されました。',
        });
      },
    });
  };

  return {
    status,
    currentTime,
    lastAction: lastActionView,
    isLoading,
    isError,
    isPending,
    todayWorkedTime,
    breakTime,
    handleAction,
  };
};
