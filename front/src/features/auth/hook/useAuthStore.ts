// src/features/auth/store.ts
import { create } from 'zustand';
import type { AuthUser } from '@/domain/auth/types';

interface AuthStore {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;

    setUser: (user: AuthUser | null) => void;
    setIsAuthenticated: (auth: boolean) => void;
    setIsInitializing: (init: boolean) => void;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitializing: true,

    setUser: (user) => set({ user }),
    setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
    setIsInitializing: (init) => set({ isInitializing: init }),
    reset: () => set({ user: null, isAuthenticated: false, isInitializing: true }),
}));