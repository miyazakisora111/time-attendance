import { useQueryClient } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';
import type { AttendanceStatus, ClockAction, ClockStatus } from '@/__generated__/enums';
import {
    actionToClockStatusMap,
    clockStatusToAttendanceStatusMap,
} from '@/domain/attendance/attendance';
import {
    attendanceQueryKeys,
    useClockInMutation,
    useClockOutMutation,
    useBreakStartMutation,
    useBreakEndMutation,
    useTodayAttendanceQuery,
} from '@/features/attendance/hooks/useAttendanceQueries';
import { formatJapaneseHourMinute, formatWorkedHours } from '@/shared/utils/format';
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
    const { data: todayAttendance, isLoading, isError } = useTodayAttendanceQuery();
    const { mutate: clockInMutate, isPending: isClockingIn } = useClockInMutation();
    const { mutate: clockOutMutate, isPending: isClockingOut } = useClockOutMutation();
    const { mutate: breakStartMutate, isPending: isBreakStarting } = useBreakStartMutation();
    const { mutate: breakEndMutate, isPending: isBreakEnding } = useBreakEndMutation();

    const isPending = isClockingIn || isClockingOut || isBreakStarting || isBreakEnding;

    const action = todayAttendance?.clockAction;
    const clockStatus: ClockStatus = action ? actionToClockStatusMap[action] : 'out';
    const attendanceStatus: AttendanceStatus = clockStatusToAttendanceStatusMap[clockStatus];

    const workedHours =
        todayAttendance?.totalWorkedMinutes != null
            ? todayAttendance.totalWorkedMinutes / 60
            : null;
    const todayWorkedTime = formatWorkedHours(workedHours);

    const handleAction = (clockAction: ClockAction) => {
        const now = new Date();
        const nowText = formatJapaneseHourMinute(now);
        const label = getClockActionLabel(clockAction);
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
            case 'break_start': {
                breakStartMutate(undefined, { onSuccess, onError });
                break;
            }
            case 'break_end': {
                breakEndMutate(undefined, { onSuccess, onError });
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
