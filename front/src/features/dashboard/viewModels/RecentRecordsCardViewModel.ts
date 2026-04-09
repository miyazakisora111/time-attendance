import { useRecentRecords } from '@/features/dashboard/hooks/useDashboardQueries';
import { buildRecentRecordsView, type RecentRecordRowView } from '@/features/dashboard/builders/buildRecentRecordsView';

export interface RecentRecordsCardView {
    records: RecentRecordRowView[];
    isLoading: boolean;
    isError: boolean;
}

/**
 * 直近勤怠記録カード専用の ViewModel。
 */
export const useRecentRecordsCardViewModel = (): RecentRecordsCardView => {
    const { data: records, isLoading, isError } = useRecentRecords();

    return {
        records: records ? buildRecentRecordsView(records) : [],
        isLoading,
        isError,
    };
};
