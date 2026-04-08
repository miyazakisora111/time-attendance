import { motion } from 'framer-motion';

import { fadeUp } from '@/shared/animations/presets';
import { transitionNormal } from '@/shared/animations/transitions';

/**
 * ページ遷移用のアニメーションラッパー。
 * Outlet の直接の子として使用する。
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={transitionNormal}
        >
            {children}
        </motion.div>
    );
}
