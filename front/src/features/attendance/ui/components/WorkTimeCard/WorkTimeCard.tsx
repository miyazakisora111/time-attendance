import type { WorkTimeCardView } from './createWorkTimeCardView';
import { Card, Typography } from '@/shared/components';

interface Props {
    view: WorkTimeCardView;
}

export function WorkTimeCard({ view }: Props) {
    return (
        <Card
            padding="lg"
            intent="primary"
            unstableClassName="border-none shadow-sm rounded-3xl"
        >
            <div className="flex flex-col justify-between h-full">
                <div>
                    <Typography
                        variant="small"
                        unstableClassName="opacity-80 mb-1 font-medium"
                    >
                        現在の勤務時間
                    </Typography>
                    <Typography
                        variant="h3"
                        unstableClassName="mb-6 tracking-tight"
                    >
                        {view.totalWorkedTime}
                    </Typography>
                </div>
                <div className="pt-6 border-t border-blue-500/50 space-y-2">
                    <div className="flex items-center justify-between">
                        <Typography variant="small">休憩合計</Typography>
                        <Typography variant="label">{view.breakTime}</Typography>
                    </div>
                    <div className="flex items-center justify-between">
                        <Typography variant="small">残業時間</Typography>
                        <Typography variant="label">{view.overtimeTime}</Typography>
                    </div>
                </div>
            </div>
        </Card>
    );
}
