/**
 * 認証ストア (Zustand)
 * 
 * 責務:
 * - 認証ユーザー データの保持
 * - ログイン/ログアウト UI 状態
 * - 認証トークン (Sanctum: Cookie)
 * 
 * ⚠️ 禁止:
 * - API call を直接実行 (→ api.ts)
 * - APIレスポンス全体をキャッシュ (→ TanStack Query)
 * 
 * ✅ 許可:
 * - UI 状態（isLoading など）
 * - ユーザーメタデータ（名前、role のみ）
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * 認証ユーザー型
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  department_id?: string;
  avatar_url?: string;
}

/**
 * 認証ストア状態
/**
 * 認証ストア状態の型定義
 * 
 * note: インターフェース内のすべてのプロパティは、
 *       Zustand state で使用される
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface AuthStoreState {
  // 状態
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  error: string | null;

  // アクション
  setUser: (user: AuthUser | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsInitializing: (isInitializing: boolean) => void;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true, // ページリロード時は初期化中
  isLoggingIn: false,
  error: null,
};

/**
 * 認証ストア
 * 
 * 使用例:
 * ```tsx
 * const user = useAuthStore((state) => state.user);
 * const logout = useAuthStore((state) => state.logout);
 * ```
 * 
 * note: インターフェースのプロパティはすべて使用される
 *       (Zustand の create で動的にアクセスされるため)
 */
export const useAuthStore = create<AuthStoreState>()(
  immer((set) => ({
    ...initialState,

    setUser: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      }),

    setIsAuthenticated: (isAuthenticated) =>
      set((state) => {
        state.isAuthenticated = isAuthenticated;
      }),

    setIsInitializing: (isInitializing) =>
      set((state) => {
        state.isInitializing = isInitializing;
      }),

    setIsLoggingIn: (isLoggingIn) =>
      set((state) => {
        state.isLoggingIn = isLoggingIn;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    logout: () =>
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      }),

    reset: () =>
      set(() => initialState),
  }))
);
