import type { Variants } from 'framer-motion';

/** フェードイン */
export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
};

/** 下から浮き上がるフェード */
export const fadeUp: Variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
};

/** 左からスライドインするフェード */
export const fadeLeft: Variants = {
    initial: { opacity: 0, x: -8 },
    animate: { opacity: 1, x: 0 },
};

/** 拡大フェードイン */
export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
};

/** 状態切り替え（AnimatePresence 用） */
export const statusSwitch: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};
