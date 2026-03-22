import { useErrorStore } from '@/shared/stores/errorStore';

/**
 * エラーモーダル用 hook。
 *
 * Zustand store の薄いラッパー。
 * コンポーネントから直接 useErrorStore を呼んでもよいが、
 * セレクタ分割と命名の統一のために hook を提供する。
 */
export function useErrorModal() {
    const isOpen = useErrorStore((s) => s.isOpen);
    const title = useErrorStore((s) => s.title);
    const messages = useErrorStore((s) => s.messages);
    const closeError = useErrorStore((s) => s.clearError);

    return { isOpen, title, messages, closeError } as const;
}
