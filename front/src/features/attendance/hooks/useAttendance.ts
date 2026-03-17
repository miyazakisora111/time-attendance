import { toast as sonner } from 'sonner';
import { useMemo, useState } from 'react';
import type { AttendanceStatus, ClockStatus, LastAction } from '@/domain/time-attendance/attendance';
import type { ClockAction } from '@/domain/time-attendance/clock-action';
import { useCurrentTime } from '@/features/attendance/hooks/useCurrentTime';
import {
  useAttendanceDashboard,
  useClockIn,
  useClockOut,
} from '@/features/attendance/hooks/useAttendanceData';
import { formatJapaneseHourMinute, formatWorkedHours } from '@/shared/presentation/format';
import { getActionLabel } from '@/shared/presentation/action-label';

/**
 * 勤怠画面の表示状態を管理するカスタムフック。
 */
export const useAttendance = () => {
  const currentTime = useCurrentTime();
  const { data, isLoading, isError } = useAttendanceDashboard();
  const { mutate: clockInMutate, isPending: isClockingIn } = useClockIn();
  const { mutate: clockOutMutate, isPending: isClockingOut } = useClockOut();
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const isPending = isClockingIn || isClockingOut;

  // ステータス
  const status = useMemo<AttendanceStatus>(() => {
    const raw = (data?.clockStatus ?? 'out') as ClockStatus;
    const map: Record<ClockStatus, AttendanceStatus> = {
      in: 'working',
      out: 'out',
      break: 'break',
    };
    return map[raw];
  }, [data?.clockStatus]);

  // 実働時間
  const todayWorkedTime = useMemo(() => {
    return formatWorkedHours(data?.totalWorkedMs ?? null);
  }, [data?.totalWorkedMs]);

  // 最後の打刻アクション
  const lastActionView = useMemo(
    () => (lastAction ? { type: getActionLabel(lastAction.action), time: lastAction.time } : null),
    [lastAction]
  );

  /**
   * 打刻操作ハンドラー
   */
  const handleAction = (action: ClockAction) => {
    const now = new Date();
    const nowText = formatJapaneseHourMinute(now);
    const label = getActionLabel(action);

    const onSuccess = () => {
      setLastAction({ action, time: nowText });
      sonner.success(`${label}しました (${nowText})`);
    };

    const onError = (err: unknown) => {
      sonner.error(`${label}に失敗しました`);
    };

    switch (action) {
      case 'in': {
        clockInMutate(
          {
            start_time: now.toISOString(),
            work_date: data?.workDate ?? now.toISOString().slice(0, 10),
          },
          { onSuccess, onError }
        );
        break;
      }
      case 'out': {
        clockOutMutate(
          {
            end_time: now.toISOString(),
            work_date: data?.workDate ?? now.toISOString().slice(0, 10),
          },
          { onSuccess, onError }
        );
        break;
      }
      default:
        sonner.error('未対応の打刻アクションです');
    }
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