import { useRecentRecords } from '@/features/dashboard/hooks/useDashboardQueries';
import { buildRecentRecordsView } from '@/features/dashboard/assemblers/buildRecentRecordsView';
import type { RecentRecordsCardProps } from '@/features/dashboard/ui/components/RecentRecordsCard/RecentRecordsCard.types';

/**
 * 直近勤怠記録のHook。
 * データを取得し、View生成はlibに委譲する。
 */
export const useRecentRecordsCard = (): RecentRecordsCardProps => {
    const { data: records, isLoading, isError } = useRecentRecords();

    return {
        records: records ? buildRecentRecordsView(records) : [],
        isLoading,
        isError,
    };
};
