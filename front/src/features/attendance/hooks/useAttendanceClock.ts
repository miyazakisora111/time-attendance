import { useQueryClient } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';
import type { AttendanceStatus, ClockAction, ClockStatus } from '@/__generated__/enums';
import { clockStatusToAttendanceStatusMap } from '@/domain/attendance/attendance';
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

    const clockStatus: ClockStatus = todayAttendance?.clockStatus ?? 'out';
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

        const onSuccess = () => {

            // 打刻後は最新の勤怠情報を取得し直す
            void queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.all() });

            options?.onActionSuccess?.({ action: clockAction, timeText: nowText });
            sonner.success(`${label}しました (${nowText})`);
        };

        const onError = () => {
            sonner.error(`${label}に失敗しました`);
        };

        switch (clockAction) {
            case 'in': {
                clockInMutate({ options: { onSuccess, onError } });
                break;
            }
            case 'out': {
                clockOutMutate({ options: { onSuccess, onError } });
                break;
            }
            case 'breakStart': {
                breakStartMutate({ options: { onSuccess, onError } });
                break;
            }
            case 'breakEnd': {
                breakEndMutate({ options: { onSuccess, onError } });
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
        breakMinutes: todayAttendance?.breakMinutes ?? null,
        isLoading,
        isError,
        isPending,
        handleAction,
    };
};
