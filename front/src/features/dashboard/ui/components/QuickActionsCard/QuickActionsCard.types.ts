export type QuickActionKey = 'attendance_fix' | 'monthly_report';

export interface QuickActionsCardProps {
    onAction: (key: QuickActionKey) => void;
}
