import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

export type ErrorModalInput = {
    status?: number;
    title: string;
    messages: string[];
};

type ErrorModalState = {
    isOpen: boolean;
    status?: number;
    title: string;
    messages: string[];
};

type ErrorModalActions = {
    open: (input: ErrorModalInput) => void;
    close: () => void;
};

type ErrorModalStore = ErrorModalState & ErrorModalActions;

const initialState: ErrorModalState = {
    isOpen: false,
    status: undefined,
    title: '',
    messages: [],
};

export const errorModalStore = create<ErrorModalStore>((set) => ({
    ...initialState,

    open: (input) =>
        set({
            isOpen: true,
            status: input.status,
            title: input.title,
            messages: input.messages,
        }),

    close: () => set(initialState),
}));

export function useErrorModal() {
    return errorModalStore(
        useShallow((s) => ({
            isOpen: s.isOpen,
            title: s.title,
            messages: s.messages,
            close: s.close,
        }))
    );
}