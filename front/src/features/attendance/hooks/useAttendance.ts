import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';
import type { ClockAction, ClockStatus } from '@/__generated__/enums';
import { clockStatusToAttendanceStatusMap } from '@/domain/attendance/attendance';
import {
  attendanceQueryKeys,
  useClockMutation,
  useLatestAttendanceQuery,
} from '@/features/attendance/hooks/useAttendanceQueries';
import { formatJapaneseHourMinute } from '@/shared/utils/format';
import { getClockActionLabel } from '@/shared/presentation/attendance/clockAction';
import { AttendanceStatus } from '../../../__generated__/model/attendanceStatus';
import type {
  AttendanceView,
  LastAction,
  LastActionView,
} from '@/features/attendance/ui/model';
import { createEmptyAttendanceView } from '../ui/model/AttendanceView';

/**
 * 勤怠画面用カスタムフック
 */
export const useAttendance = (): AttendanceView & {
  attendanceStatus: AttendanceStatus;
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;
  handleAction: (action: ClockAction) => void;
  lastAction: LastActionView | null;
} => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useLatestAttendanceQuery();
  const { mutate: clockMutate, isPending } = useClockMutation();
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const attendanceView: AttendanceView = data ?? createEmptyAttendanceView();
  const clockStatus: ClockStatus = attendanceView?.clockStatus ?? 'out';

  const handleAction = (clockAction: ClockAction) => {
    const now = new Date();
    const time = formatJapaneseHourMinute(now);
    const label = getClockActionLabel(clockAction);

    clockMutate(clockAction, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: attendanceQueryKeys.all(),
        });

        setLastAction({ clockAction, time });
        sonner.success(`${label}しました (${time})`);
      },
      onError: () => {
        sonner.error(`${label}に失敗しました`);
      },
    });
  };

  return {
    ...attendanceView,
    attendanceStatus: clockStatusToAttendanceStatusMap[clockStatus],
    isLoading,
    isError,
    isPending,
    handleAction,
    lastAction: lastAction
      ? {
        label: getClockActionLabel(lastAction.clockAction),
        time: lastAction.time,
      }
      : null,
  };

};