import type { ClockAction } from '@/__generated__/enums';
import type { ClockInCardView } from '@/features/attendance/ui/components/ClockInCard/ClockInCard.types';
import type { MiniCalendarProps } from '@/features/dashboard/ui/components/MiniCalendar/MiniCalendar.types';
import type { MonthlyStatsCardProps } from '@/features/dashboard/ui/components/MonthlyStatsCard/MonthlyStatsCard.types';
import type { RecentRecordsCardProps } from '@/features/dashboard/ui/components/RecentRecordsCard/RecentRecordsCard.types';
import type { QuickActionsCardProps } from '@/features/dashboard/ui/components/QuickActionsCard/QuickActionsCard.types';

export interface DashboardPageView {
    userName: string | undefined;
    clockInCard: ClockInCardView;
    miniCalendar: MiniCalendarProps;
    monthlyStats: MonthlyStatsCardProps;
    recentRecords: RecentRecordsCardProps;
}

export interface DashboardPageProps extends DashboardPageView {
    handleAction: (action: ClockAction) => void;
    handleQuickAction: QuickActionsCardProps['onAction'];
}
