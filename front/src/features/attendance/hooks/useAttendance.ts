import { toast as sonner } from 'sonner';
import { useMemo, useState } from 'react';
import { type AttendanceStatus } from '@/domain/attendance/attendance';
import { useCurrentTime } from '@/features/attendance/hooks/useCurrentTime';
import {
  useTodayAttendance,
  useClockIn,
  useClockOut,
} from '@/features/attendance/hooks/useAttendanceData';
import { formatJapaneseHourMinute, formatWorkedHours } from '@/shared/presentation/format';
import { clockActionLabelMap } from '@/shared/presentation/attendance';
import { type LastAction } from '@/features/attendance/ui/types';
import type { ClockAction } from '@/domain/attendance/attendance';

/**
 * 勤怠画面の表示状態を管理するカスタムフック。
 */
export const useAttendance = () => {
  const currentTime = useCurrentTime();
  const { data, isLoading, isError } = useTodayAttendance();
  const { mutate: clockInMutate, isPending: isClockingIn } = useClockIn();
  const { mutate: clockOutMutate, isPending: isClockingOut } = useClockOut();
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  const isPending = isClockingIn || isClockingOut;

  // ステータス
  const status = useMemo<AttendanceStatus>(() => {
    return (data?.clockAction ?? 'out') as AttendanceStatus;
  }, [data?.clockAction]);

  // 実働時間
  const todayWorkedTime = useMemo(() => {
    return formatWorkedHours(data?.totalWorkedMs ?? null);
  }, [data?.totalWorkedMs]);

  // 最後の打刻アクション
  const lastActionView = useMemo(
    () => (lastAction ? { type: clockActionLabelMap[lastAction.clockAction], time: lastAction.time } : null),
    [lastAction]
  );

  /**
   * 打刻操作ハンドラー
   */
  const handleAction = (clockAction: ClockAction) => {
    const now = new Date();
    const nowText = formatJapaneseHourMinute(now);
    const label = clockActionLabelMap[clockAction];

    const onSuccess = () => {
      setLastAction({ clockAction, time: nowText });
      sonner.success(`${label}しました (${nowText})`);
    };

    const onError = () => {
      sonner.error(`${label}に失敗しました`);
    };

    switch (clockAction) {
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
      case 'break_start':
      case 'break_end': {
        sonner.info('この操作はまだ実装されていません');
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