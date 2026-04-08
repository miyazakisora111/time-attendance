import type { ClockStatus } from '@/__generated__/enums';

/**
 * 勤怠画面用 ViewModel
 */
export type AttendancePageView = {
    clockStatus: ClockStatus;
    isLoading: boolean;
    isError: boolean;
    isActionPending: boolean;
    workTimeCardView: WorkTimeCardView;
    lastActionView: RecentActivityCardView | null;
    handleAction: (action: ClockAction) => void;
};

/**
 * AttendancePageView のデフォルト値
 */
export const attendancePageViewDefaults: AttendancePageView = {
    clockStatus: 'out',
    totalWorkedMinutes: 0,
    breakMinutes: 0,
    overtimeMinutes: 0,
    clockInAt: null,
    clockOutAt: null,
    workDate: '',
};
