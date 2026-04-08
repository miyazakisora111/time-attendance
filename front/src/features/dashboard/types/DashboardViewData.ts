import type { ClockStatus } from '@/__generated__/enums';
import type {
    DashboardRecentRecord,
    DashboardStats,
    DashboardTodayRecord,
    DashboardUser,
} from '@/__generated__/model';

/** ダッシュボードの統合データ */
export interface DashboardViewData {
    user: DashboardUser;
    clockStatus: ClockStatus;
    todayRecord: DashboardTodayRecord;
    recentRecords: DashboardRecentRecord[];
    stats: DashboardStats;
}
