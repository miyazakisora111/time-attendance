import { toast as sonner } from 'sonner';
import { useMemo, useState } from 'react';
import type { AttendanceStatus, ClockStatus, LastAction } from '@/domain/time-attendance/attendance';
import type { ClockAction } from '@/domain/time-attendance/clock-action';
import { useCurrentTime } from '@/features/attendance/hooks/useCurrentTime';
import { useAttendanceClockAction, useAttendanceDashboard } from '@/features/attendance/hooks/useAttendanceData';
import {
  formatJapaneseHourMinute,
  formatWorkedHours,
} from '@/shared/presentation/format';
import { getActionLabel } from '@/shared/presentation/action-label';
import {
  mapClockStatusToAttendanceStatus,
  toLastActionView,
} from '@/shared/presentation/time-attendance';

/**
 * 勤怠画面の表示状態を管理するカスタムフック。
 */
export const useAttendance = () => {
  const currentTime = useCurrentTime();
  const { data, isLoading, isError } = useAttendanceDashboard();
  const { mutate: clockAction, isPending } = useAttendanceClockAction();
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  // 勤怠ステータスを算出
  const status = useMemo<AttendanceStatus>(() => {
    const rawStatus = (data?.clockStatus ?? 'out') as ClockStatus;
    return mapClockStatusToAttendanceStatus(rawStatus);
  }, [data?.clockStatus]);

  // 本日の実働時間を整形
  const todayWorkedTime = useMemo(() => {
    return formatWorkedHours(data?.todayRecord?.totalWorkedHours);
  }, [data?.todayRecord?.totalWorkedHours]);

  // 直近アクションの表示用オブジェクトに変換
  const lastActionView = useMemo(() => {
    if (!lastAction) return null;
    return toLastActionView(lastAction);
  }, [lastAction]);

  /**
   * 画面上の打刻操作を実行するハンドラー。
   *
   * @param action 実行する打刻アクション
   */
  const handleAction = (action: ClockAction) => {
    const nowText = formatJapaneseHourMinute(new Date());
    const label = getActionLabel(action);

    // API実行
    clockAction(action, {
      onSuccess: () => {
        setLastAction({ action, time: nowText });
        sonner.success(`${label}しました (${nowText})`);
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
    handleAction,
  };
};