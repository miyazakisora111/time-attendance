import type { ClockAction } from '@/__generated__/enums';
import type { ClockInCardView } from '@/features/attendance/ui/components/ClockInCard/ClockInCard.types';
import type { MiniCalendarProps } from '@/features/dashboard/ui/components/MiniCalendar/MiniCalendar.types';
import type { MonthlyStatsCardProps } from '@/features/dashboard/ui/components/MonthlyStatsCard/MonthlyStatsCard.types';
import type { RecentRecordsCardProps } from '@/features/dashboard/ui/components/RecentRecordsCard/RecentRecordsCard.types';

/** ダッシュボードの統合データ */
export interface DashboardPageView {
    user: DashboardUser;
    clockStatus: ClockStatus;
    todayRecord: DashboardTodayRecord;
    recentRecords: DashboardRecentRecord[];
    stats: DashboardStats;
}

export interface DashboardPageProps {
    userName: string | undefined;
    clockInCard: ClockInCardView;
    handleAction: (action: ClockAction) => void;
    miniCalendar: MiniCalendarProps;
    monthlyStats: MonthlyStatsCardProps;
    recentRecords: RecentRecordsCardProps;
}
