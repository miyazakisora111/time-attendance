import { create } from 'zustand';

/**
 * グローバルエラーモーダル表示用のペイロード。
 */
export type ErrorPayload = {
    /** HTTPステータス（任意） */
    status?: number;
    /** エラータイトル */
    title: string;
    /** 表示メッセージ一覧 */
    messages: string[];
};

type ErrorStoreState = {
    /** モーダル表示中か */
    isOpen: boolean;
    /** HTTPステータス */
    status: number | undefined;
    /** タイトル */
    title: string;
    /** メッセージ一覧 */
    messages: string[];
};

type ErrorStoreActions = {
    /**
     * エラーを表示する。
     * 既にモーダルが開いている場合は上書きしない（多重表示防止）。
     */
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
 * グローバルエラーストア。
 *
 * Zustand を採用した理由:
 * - React 外（axios interceptor）から getState() 経由で安全に書き込める
 * - Context + Provider が不要になり、Provider ツリーの複雑性が減る
 * - setApiErrorHandler のようなコールバック登録パターンを排除できる
 */
export const useErrorStore = create<ErrorStore>()((set, get) => ({
    ...initialState,

    setError: (payload) => {
        // 多重表示防止: 既にモーダルが開いている場合は上書きしない
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
