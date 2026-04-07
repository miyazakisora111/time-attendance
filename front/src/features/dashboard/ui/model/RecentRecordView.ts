/** 最近の勤怠記録 */
export interface RecentRecordView {
    date: string;
    day: string;
    clockIn: string | null;
    clockOut: string | null;
    workHours: number | null;
    status: string;
}