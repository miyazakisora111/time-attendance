import { toast as sonner } from 'sonner';
import type { AttendanceStatus, LastAction } from '@/domain/enums/attendance';
import { useCurrentTime } from '@/features/attendance/hooks/useCurrentTime';
import { useAttendanceClockAction, useAttendanceDashboardData } from '@/features/attendance/hooks/useAttendanceData';
import {
  mapClockStatusToAttendanceStatus,
  formatWorkedHours,
  toLastAction,
} from '@/features/attendance/lib/attendanceViewModel';
import type { ClockAction, ClockStatus } from '@/features/dashboard/ui/clock/ClockActionButtons';
import { useMemo, useState } from 'react';

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

  const breakTime = useMemo(() => {
    return '--:--';
  }, []);

  /**
   * 画面の打刻操作を API アクションへ変換して実行する。
   *
   * @param type 次状態
   * @param label 画面表示ラベル
   */
  const handleAction = (type: AttendanceStatus, label: string) => {
    const actionMap: Record<AttendanceStatus, ClockAction> = {
      out: 'out',
      working: label === '休憩終了' ? 'break_end' : 'in',
      break: 'break_start',
    };
    const action = actionMap[type];

    const nowText = new Date().toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });

    clockAction(action, {
      onSuccess: () => {
        setLastAction(toLastAction(action, nowText));
        sonner.success(`${label}しました (${nowText})`, {
          description: '本日の勤務データに記録されました。',
        });
      },
    });
  };

  return {
    status,
    currentTime,
    lastAction,
    isLoading,
    isError,
    isPending,
    todayWorkedTime,
    breakTime,
    handleAction,
  };
};
