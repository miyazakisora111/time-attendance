import { create } from "zustand";

/**
 * 認証ストアで保持するユーザー情報。
 */
interface AuthUserState {
    id: string;
    name: string;
    email: string;
    roles: string[];
    settings?: Record<string, unknown> | null;
}

/**
 * 認証状態のグローバルストア。
 */
interface AuthStore {
    user: AuthUserState | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    setUser: (user: AuthUserState | null) => void;
    setIsAuthenticated: (auth: boolean) => void;
    setIsInitializing: (init: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitializing: true,

    setUser: (user) => set({ user }),
    setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
    setIsInitializing: (init) => set({ isInitializing: init }),
}));
