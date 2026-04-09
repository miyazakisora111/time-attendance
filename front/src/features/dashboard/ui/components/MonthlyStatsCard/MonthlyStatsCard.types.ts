import type { LucideIcon } from 'lucide-react';
import type { MonthlyStatKey } from '@/features/dashboard/assemblers/buildMonthlyStatsView';

export interface MonthlyStatItemView {
    key: MonthlyStatKey;
    label: string;
    value: string;
    subtext: string;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
}

export interface MonthlyStatsCardProps {
    stats: MonthlyStatItemView[];
    isLoading: boolean;
    isError: boolean;
}
