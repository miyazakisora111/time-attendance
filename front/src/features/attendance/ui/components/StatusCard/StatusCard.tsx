import { Card, Typography, IconWrapper } from '@/shared/components';

import type { StatusCardView } from './createStatusCardView';

interface Props {
    view: StatusCardView;
}

export function StatusCard({ view }: Props) {
    return (
        <Card
            variant="flat"
            intent={view.intent}
            padding="md"
            unstableClassName="transition-colors duration-500"
        >
            <div className="flex flex-col items-center justify-center text-center h-full">
                <IconWrapper
                    icon={view.icon}
                    size={32}
                    strokeWidth={2.5}
                    iconColor={view.iconColor}
                    bgColor="bg-white shadow-sm"
                    unstableClassName="w-16 h-16 mb-4 rounded-2xl"
                />
                <Typography
                    variant="h3"
                    intent={view.intent}
                    unstableClassName="mb-2"
                >
                    {view.title}
                </Typography>
                <Typography
                    variant="small"
                    intent={view.intent}
                    align="center"
                    unstableClassName="block leading-relaxed"
                >
                    {view.description}
                </Typography>
            </div>
        </Card>
    );
}
