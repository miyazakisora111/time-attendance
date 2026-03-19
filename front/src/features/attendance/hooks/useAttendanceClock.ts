import { useQueryClient } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';
import type { AttendanceStatus, ClockAction, ClockStatus } from '@/domain/attendance/attendance';
import {
  attendanceQueryKeys,
  useClockInMutation,
  useClockOutMutation,
  useTodayAttendanceQuery,
} from '@/features/attendance/hooks/useAttendanceQueries';
import { formatJapaneseHourMinute, formatWorkedHours } from '@/shared/presentation/format';
import { clockActionLabelMap } from '@/shared/presentation/attendance';

export interface ClockActionSuccessPayload {
  action: ClockAction;
  timeText: string;
}

interface UseAttendanceClockOptions {
  onActionSuccess?: (payload: ClockActionSuccessPayload) => void;
}

/**
 * 勤怠打刻に関するデータ取得と操作をまとめた共通 hook。
 */
export const useAttendanceClock = (options?: UseAttendanceClockOptions) => {
  const queryClient = useQueryClient();
  const { data: todayAttendance, isLoading, isError } = useTodayAttendanceQuery();
  const { mutate: clockInMutate, isPending: isClockingIn } = useClockInMutation();
  const { mutate: clockOutMutate, isPending: isClockingOut } = useClockOutMutation();

  const isPending = isClockingIn || isClockingOut;

  const action = todayAttendance?.clockAction;
  const clockStatus: ClockStatus =
    action === 'in' || action === 'break_end'
      ? 'in'
      : action === 'break_start'
        ? 'break'
        : 'out';

  const attendanceStatus: AttendanceStatus =
    clockStatus === 'in' ? 'working' : clockStatus === 'break' ? 'break' : 'out';

  const workedHours =
    todayAttendance?.totalWorkedMs != null
      ? todayAttendance.totalWorkedMs / (1000 * 60 * 60)
      : null;
  const todayWorkedTime = formatWorkedHours(workedHours);

  const handleAction = (clockAction: ClockAction) => {
    const now = new Date();
    const nowText = formatJapaneseHourMinute(now);
    const label = clockActionLabelMap[clockAction];
    const workDate = todayAttendance?.workDate ?? now.toISOString().slice(0, 10);

    const onSuccess = () => {
      void queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.todayAttendance() });
      options?.onActionSuccess?.({ action: clockAction, timeText: nowText });
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
            work_date: workDate,
          },
          { onSuccess, onError }
        );
        break;
      }
      case 'out': {
        clockOutMutate(
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
    clockStatus,
    attendanceStatus,
    todayAttendance,
    todayWorkedTime,
    isLoading,
    isError,
    isPending,
    handleAction,
  };
};
