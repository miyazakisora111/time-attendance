import { create } from 'zustand';

/**
 * グローバルエラーモーダルに渡す表示データ。
 */
type ErrorPayload = {
    /** HTTPステータス（任意） */
    status?: number;
    /** モーダルに表示するタイトル */
    title: string;
    /** 表示するエラーメッセージ一覧 */
    messages: string[];
};

type ErrorStoreState = {
    /** モーダルが表示中かどうか */
    isOpen: boolean;
    /** HTTPステータス */
    status?: number;
    /** タイトル */
    title: string;
    /** メッセージ一覧 */
    messages: string[];
};

type ErrorStoreActions = {
    /** エラーモーダルを表示する */
    setError: (payload: ErrorPayload) => void;
    /** モーダルを閉じて状態をリセットする */
    clearError: () => void;
};

type ErrorStore = ErrorStoreState & ErrorStoreActions;

const initialState: ErrorStoreState = {
    isOpen: false,
    status: undefined,
    title: '',
    messages: [],
};

/**
 * エラー状態を管理する Zustand ストア
 */
export const useErrorStore = create<ErrorStore>()((set, get) => ({
    ...initialState,

    setError: (payload) => {
        // 多重表示を避けるため、表示中は上書きしない
        if (get().isOpen) return;

        set({
            isOpen: true,
            status: payload.status,
            title: payload.title,
            messages: payload.messages,
        });
    },

    clearError: () => {
        set(initialState);
    },
}));
