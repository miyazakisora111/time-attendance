import type { RecentRecordRowView } from '@/features/dashboard/assemblers/buildRecentRecordsView';

export interface RecentRecordsCardProps {
    records: RecentRecordRowView[];
    isLoading: boolean;
    isError: boolean;
}
