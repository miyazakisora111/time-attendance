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
    const { data: LatestAttendance, isLoading, isError } = useLatestAttendanceQuery();
    const { mutate: clockMutate, isPending } = useClockMutation();

    // データが存在しない場合は、未出勤のため「out」とする
    const clockStatus: ClockStatus = LatestAttendance?.clockStatus ?? 'out';

    const handleAction = (clockAction: ClockAction) => {
        const now = new Date();
        const nowText = formatJapaneseHourMinute(now);
        const label = getClockActionLabel(clockAction);

        clockMutate(clockAction, {
            onSuccess: () => {
                // 打刻後は最新の勤怠情報を取得し直す
                void queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.all() });

                options?.onActionSuccess?.({ action: clockAction, timeText: nowText });
                sonner.success(`${label}しました (${nowText})`);
            },
            onError: () => {
                sonner.error(`${label}に失敗しました`);
            }
        });
    };

    return {
        ...LatestAttendance,
        clockStatus,
        attendanceStatus: clockStatusToAttendanceStatusMap[clockStatus],
        isLoading,
        isError,
        isPending,
        handleAction,
    };
};
