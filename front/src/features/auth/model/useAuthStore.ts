import { create } from "zustand";

interface AuthStore {
    user: any | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    setUser: (user: any | null) => void;
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
