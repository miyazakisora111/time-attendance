import { toast as sonner } from 'sonner';
import { useMemo, useState } from 'react';
import { type AttendanceStatus } from '@/domain/attendance/attendance';
import { useCurrentTime } from '@/features/attendance/hooks/useCurrentTime';
import {
  useTodayAttendanceQuery,
  useClockInMutation,
  useClockOutMutation,
} from '@/features/attendance/hooks/useAttendanceQueries';
import { formatJapaneseHourMinute, formatWorkedHours } from '@/shared/presentation/format';
import { clockActionLabelMap } from '@/shared/presentation/attendance';
import { type LastAction } from '@/features/attendance/ui/types';
import type { ClockAction } from '@/domain/attendance/attendance';

/**
 * 勤怠画面の表示状態を管理するカスタムフック。
 */
export const useAttendance = () => {
  const currentTime = useCurrentTime();
  const { data: todayAttendance, isLoading, isError } = useTodayAttendanceQuery();
  const { mutate: useClockInMutate, isPending: isClockingIn } = useClockInMutation();
  const { mutate: useClockOutMutate, isPending: isClockingOut } = useClockOutMutation();
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  const isPending = isClockingIn || isClockingOut;

  // ステータス
  const status = useMemo<AttendanceStatus>(() => {
    return (todayAttendance?.clockAction ?? 'out') as AttendanceStatus;
  }, [todayAttendance?.clockAction]);

  // 実働時間
  const todayWorkedTime = useMemo(() => {
    return formatWorkedHours(todayAttendance?.totalWorkedMs ?? null);
  }, [todayAttendance?.totalWorkedMs]);

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

    const workDate = todayAttendance?.workDate ?? now.toISOString().slice(0, 10);
    switch (clockAction) {
      case 'in': {
        useClockInMutate(
          {
            start_time: now.toISOString(),
            work_date: workDate,
          },
          { onSuccess, onError }
        );
        break;
      }
      case 'out': {
        useClockOutMutate(
          {
            end_time: now.toISOString(),
            work_date: workDate,
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