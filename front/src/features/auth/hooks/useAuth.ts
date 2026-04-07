import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthMe, useLogin, useLogout, authQueryKeys } from '@/features/auth/hooks/useAuthQueries';
import { authStore } from '@/shared/stores/authStore';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/lib/http/client';
import type { AuthUser, LoginResult } from '@/domain/auth/types';

/**
 * 認証状態のフック
 */
export const useAuth = () => {
    const queryClient = useQueryClient();

    // グローバルStore
    const { setUser, setIsAuthenticated, setIsInitializing } = authStore.getState();
    const isInitializing = authStore((state) => state.isInitializing);

    // トークンの有無を見て /me を有効化
    const hasToken = !!getAuthToken();

    // React Query（副作用なし版）を呼ぶ
    const authQuery = useAuthMe(hasToken);

    // Store 同期
    useEffect(() => {
        if (!hasToken) {
            setUser(null);
            setIsAuthenticated(false);
            setIsInitializing(false);
            return;
        }

        if (authQuery.isSuccess) {
            setUser(authQuery.data as AuthUser);
            setIsAuthenticated(true);
            setIsInitializing(false);
            return;
        }

        if (authQuery.isError) {
            clearAuthToken();
            setUser(null);
            setIsAuthenticated(false);
            setIsInitializing(false);
            // 失敗後の不要データを除去
            queryClient.removeQueries({ queryKey: authQueryKeys.authMe() });
            return;
        }

        if (authQuery.isLoading) {
            setIsInitializing(true);
        }
    }, [
        hasToken,
        authQuery.isLoading,
        authQuery.isSuccess,
        authQuery.isError,
        authQuery.data,
        queryClient,
        setUser,
        setIsAuthenticated,
        setIsInitializing,
    ]);

    // ログイン
    const loginMutation = useLogin({
        onSuccess: async (result: LoginResult) => {
            if (result.token) setAuthToken(result.token);
            await queryClient.invalidateQueries({ queryKey: authQueryKeys.authMe() });
        },
        onError: () => {
            clearAuthToken();
        },
    });

    // ログアウト
    const logoutMutation = useLogout({
        onSuccess: () => {
            clearAuthToken();
            queryClient.removeQueries({ queryKey: authQueryKeys.authMe() });
            authStore.getState().reset();
        },
        onError: () => {
            // ネットワーク失敗でも確実にログアウト
            clearAuthToken();
            queryClient.removeQueries({ queryKey: authQueryKeys.authMe() });
            authStore.getState().reset();
        },
    });

    return {
        user: authStore((state) => state.user),
        isAuthenticated: authStore((state) => state.isAuthenticated),
        isLoading: authQuery.isLoading || isInitializing,
        loginMutation,
        logoutMutation,
    };
};