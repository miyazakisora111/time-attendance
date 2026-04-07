import { useErrorStore } from '@/shared/stores/errorStore';

/** エラーモーダル表示用 hook */
export function useErrorModal() {
    return useErrorStore((s) => ({
        isOpen: s.isOpen,
        title: s.title,
        messages: s.messages,
        closeError: s.clearError,
    }));
}