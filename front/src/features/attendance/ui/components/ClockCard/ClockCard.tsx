import { motion } from 'framer-motion';
import { MapPin, Shield } from 'lucide-react';

import { Card, Typography, Clock } from '@/shared/components';
import { fadeUp } from '@/shared/animations/presets';
import { transitionNormal } from '@/shared/animations/transitions';

export function ClockCard() {
    return (
        <Card variant="flat" padding="lg">
            <div className="flex flex-col items-center justify-center h-full">
                <motion.div
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    transition={transitionNormal}
                >
                    <Clock title={undefined} size="md" />
                </motion.div>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                    <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-300" />
                        <Typography variant="small" intent="muted">
                            東京都港区港南 / Office-A
                        </Typography>
                    </span>

                    <span className="w-1 h-1 rounded-full bg-gray-200" />

                    <span className="flex items-center gap-1.5">
                        <Shield size={14} className="text-gray-300" />
                        <Typography variant="small" intent="muted">
                            IP: 192.168.1.xxx
                        </Typography>
                    </span>
                </div>
            </div>
        </Card>
    );
}
