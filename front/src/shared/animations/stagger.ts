import type { Variants } from 'framer-motion';

/** 子要素を順次表示する親コンテナ用 variants */
export const stagger: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

/** 遅めの stagger（カード一覧など） */
export const staggerSlow: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};
