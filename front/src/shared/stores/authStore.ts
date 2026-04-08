import { create } from 'zustand';

import type { AuthUser } from '@/domain/auth/types';

/**
 * 認証状態を管理するための型定義
 */
interface AuthStore {
    /** ログイン中のユーザー情報 */
    user: AuthUser | null;

    /** 認証済みかどうか */
    isAuthenticated: boolean;

    /** 初期化中かどうか */
    isInitializing: boolean;

    /** ユーザー情報をセットする */
    setUser: (user: AuthUser | null) => void;

    /** 認証状態をセットする */
    setIsAuthenticated: (auth: boolean) => void;

    /** 初期化状態をセットする */
    setIsInitializing: (init: boolean) => void;

    /** ストアの状態を初期状態にリセットする */
    reset: () => void;
}

/**
 * 認証状態を管理する Zustand ストア
 */
export const authStore = create<AuthStore>((set) => ({
    /** ユーザー情報 */
    user: null,

    /** 認証状態 */
    isAuthenticated: false,

    /** 初期化中フラグ */
    isInitializing: true,

    /**
     * ユーザー情報を更新する
     */
    setUser: (user) => set({ user }),

    /**
     * 認証状態を更新する
     */
    setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),

    /**
     * 初期化状態を更新する
     */
    setIsInitializing: (init) => set({ isInitializing: init }),

    /**
     * ストアを初期状態に戻す
     */
    reset: () =>
        set({
            user: null,
            isAuthenticated: false,
            isInitializing: true,
        }),
}));