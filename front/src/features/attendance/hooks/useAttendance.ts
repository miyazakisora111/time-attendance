import { useMemo, useState } from 'react';
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
import type { LastAction } from '@/features/attendance/ui/types';

/**
 * 勤怠画面用カスタムフック
 */
export const useAttendance = () => {
  const queryClient = useQueryClient();
  const { data: latestAttendance, isLoading, isError } = useLatestAttendanceQuery();
  const { mutate: clockMutate, isPending } = useClockMutation();
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const clockStatus: ClockStatus = latestAttendance?.clockStatus ?? 'out';

  /**
   * 打刻処理
   */
  const handleAction = (clockAction: ClockAction) => {
    const now = new Date();
    const nowText = formatJapaneseHourMinute(now);
    const label = getClockActionLabel(clockAction);

    clockMutate(clockAction, {
      onSuccess: () => {

        // 最新勤怠を再取得
        void queryClient.invalidateQueries({
          queryKey: attendanceQueryKeys.all(),
        });

        setLastAction({
          clockAction,
          time: nowText,
        });

        sonner.success(`${label}しました (${nowText})`);
      },
      onError: () => {
        sonner.error(`${label}に失敗しました`);
      },
    });
  };

  // 最後の打刻表示用
  const lastActionView = useMemo(() => {
    if (!lastAction) return null;

    return {
      label: getClockActionLabel(lastAction.clockAction),
      time: lastAction.time,
    };
  }, [lastAction]);

  return {
    ...latestAttendance,
    clockStatus,
    attendanceStatus: clockStatusToAttendanceStatusMap[clockStatus],
    isLoading,
    isError,
    isPending,
    handleAction,
    lastAction: lastActionView,
  };
};