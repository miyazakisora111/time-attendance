/** ダッシュボードの統合データ */
export interface DashboardViewData {
    user: DashboardUser;
    clockStatus: ClockStatus;
    todayRecord: DashboardTodayRecord;
    recentRecords: DashboardRecentRecord[];
    stats: DashboardStats;
}