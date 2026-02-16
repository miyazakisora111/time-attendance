/**
 * 認証フィーチャー - React Hooks
 * 
 * 責務:
 * - useQuery (GET /auth/me)
 * - useMutation (POST /auth/login, /auth/logout)
 * - Zustand + TanStack Query の統合
 */

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, ApiError } from '@/lib';
import { useAuthStore } from './store';
import {
  apiLogin,
  apiLogout,
  apiAuthMe,
  apiRegister,
} from './api';
import type {
  LoginRequest,
  RegisterRequest,
} from './types';
import type { RegisterFormData } from './schema';

/**
 * 現在の認証状態を取得 (ページ初期化用)
 * 
 * 使用例:
 * ```tsx
 * const { data: auth, isLoading, isError } = useAuthMe();
 * 
 * useEffect(() => {
 *   if (auth?.user) {
 *     setUser(auth.user);
 *   }
 * }, [auth]);
 * ```
 */
export function useAuthMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: apiAuthMe,
    // ページ初期化時同期
    staleTime: Infinity,
    retry: false,
    // ローカルでのrefetch不可
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

/**
 * ログイン Mutation
 * 
 * 使用例:
 * ```tsx
 * const loginMutation = useLogin();
 * 
 * const handleLogin = async (email, password) => {
 *   const result = await loginMutation.mutateAsync({ email, password });
 *   // UI 状態は useAuthStore で管理
 * };
 * ```
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser, setIsLoggingIn, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiLogin(credentials);
      return response.data!;
    },
    onMutate: () => {
      setIsLoggingIn(true);
      setError(null);
    },
    onSuccess: (data) => {
      // Zustand に ユーザー情報を保存
      setUser(data.user);
      
      // Query キャッシュ無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
    },
    onError: (error: ApiError) => {
      const message = error.message || 'ログインに失敗しました';
      setError(message);
    },
    onSettled: () => {
      setIsLoggingIn(false);
    },
  });
}

/**
 * ログアウト Mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      // Zustand リセット
      logout();

      // Query キャッシュ全削除
      queryClient.clear();
    },
  });
}

/**
 * ユーザー登録 Mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const { setUser, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const registerData: RegisterRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      };
      const response = await apiRegister(registerData);
      return response.data!;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
    },
    onError: (error: ApiError) => {
      setError(error.message);
    },
  });
}

/**
 * 認証状態の自動初期化
 * 
 * ページリロード時に既存セッションを確認
 * App.tsx で useEffect 内で実行
 */
export function useAuthInitialize() {
  const { data: auth, isLoading } = useAuthMe();
  const { setUser, setIsAuthenticated, setIsInitializing } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (auth?.data?.user) {
        setUser(auth.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsInitializing(false);
    }
  }, [auth, isLoading, setUser, setIsAuthenticated, setIsInitializing]);

  return { isInitialized: !isLoading };
}
