/**
 * 認証ストア (Zustand)
 * グローバル認証状態を管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

// 開発用ダミーユーザー
const DEV_USER: User = {
  id: '1',
  email: 'dev@example.com',
  name: '開発ユーザー',
  role: 'admin',
  status: 'active',
};

const DEV_TOKEN = 'dev-token-12345';
const isDevelopment = import.meta.env.DEV;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: isDevelopment ? DEV_TOKEN : null,
      user: isDevelopment ? DEV_USER : null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const demoUser: User = {
            id: '1',
            email,
            name: 'デモユーザー',
            role: 'employee',
            status: 'active',
          };
          set({ token: 'demo-token', user: demoUser });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'ログインに失敗しました';
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ token: null, user: null, error: null });
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setError: (error) => set({ error }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
