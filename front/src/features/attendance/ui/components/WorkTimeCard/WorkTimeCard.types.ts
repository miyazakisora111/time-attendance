export interface WorkTimeCardView {
    totalWorkedTime: string;
    breakTime: string;
    overtimeTime: string;
}

export interface WorkTimeCardProps {
    view: WorkTimeCardView;
}
