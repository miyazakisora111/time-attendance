import { motion, AnimatePresence } from 'framer-motion';
import { History } from 'lucide-react';
import type { ClockAction } from '@/__generated__/enums';
import { Card, CardContent, Typography } from '@/shared/components';
import { AsyncDataState } from '@/shared/components/states/AsyncDataState';
import { stack } from '@/shared/design-system/layout';

/** 直近打刻の表示用データ */
export interface RecentActivityCardView {
    clockAction: ClockAction;
    label: string;
    time: string;
}

interface Props {
    lastAction: RecentActivityCardView | null;
    isLoading: boolean;
    isError: boolean;
}

export function RecentActivityCard({ lastAction, isLoading, isError }: Props) {
    return (
        <Card variant="elevated" padding="none" unstableClassName="col-span-1 md:col-span-2 overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
                <Typography variant="h3" unstableClassName="flex items-center gap-2">
                    <History size={18} className="text-gray-400" />
                    直近の勤怠
                </Typography>
                <Typography variant="small" intent="muted">
                    直近3件を表示
                </Typography>
            </div>
            <CardContent unstableClassName="p-6">
                <div className={stack.lg}>
                    <AsyncDataState
                        isLoading={isLoading}
                        isError={isError}
                        isEmpty={!lastAction}
                    >
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-1.5 h-10 rounded-full bg-blue-500" />
                                <div className="flex-1">
                                    <Typography variant="label">{lastAction?.label}</Typography>
                                    <Typography variant="small" intent="muted">
                                        打刻完了
                                    </Typography>
                                </div>
                                <div className="text-right">
                                    <Typography variant="h3" unstableClassName="tracking-tight tabular-nums">
                                        {lastAction?.time}
                                    </Typography>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </AsyncDataState>
                </div>
            </CardContent>
        </Card>
    );
}
