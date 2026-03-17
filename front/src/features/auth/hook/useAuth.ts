import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, authQueryKeys } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/hook/useAuthStore';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/shared/http/client';
import type { AuthUser, LoginResult } from '@/domain/auth/types';
import { QUERY_CONFIG } from '@/config/api';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { setUser, setIsAuthenticated, setIsInitializing } = useAuthStore.getState();

    const hasToken = !!getAuthToken();

    // /me クエリ：トークンがあるときだけ問い合わせ
    const authQuery = useQuery<AuthUser>({
        queryKey: authQueryKeys.me(),
        queryFn: authApi.me,
        enabled: hasToken,
        retry: false,
        staleTime: QUERY_CONFIG.defaultStaleTimeMs,
        refetchOnWindowFocus: false,
    });

    // Store 同期：Query 状態に追随（単一の真実は Query）
    useEffect(() => {
        // 1) トークンがない → すぐ未認証・初期化完了
        if (!hasToken) {
            setUser(null);
            setIsAuthenticated(false);
            setIsInitializing(false);
            return;
        }

        // 2) /me 成功
        if (authQuery.isSuccess) {
            setUser(authQuery.data);
            setIsAuthenticated(true);
            setIsInitializing(false);
            return;
        }

        // 3) /me 失敗（トークン無効など）→ トークン破棄し未認証へ
        if (authQuery.isError) {
            clearAuthToken();
            setUser(null);
            setIsAuthenticated(false);
            setIsInitializing(false);
            // 失敗後の不要な me データを安全に落とす
            queryClient.removeQueries({ queryKey: authQueryKeys.me() });
            return;
        }

        // 4) /me 読み込み中
        if (authQuery.isLoading) {
            setIsInitializing(true);
        }
    }, [authQuery.isLoading, authQuery.isSuccess, authQuery.isError, authQuery.data, hasToken, queryClient, setUser, setIsAuthenticated, setIsInitializing]);

    // ログイン：トークン保存 → /me 取得 → Store 同期
    const loginMutation = useMutation({
        mutationKey: ['auth', 'login'],
        mutationFn: (credentials: { email: string; password: string }) => authApi.login(credentials),
        onSuccess: async (result: LoginResult) => {
            if (result.token) {
                setAuthToken(result.token);
            }
            // すぐに /me を最新化
            await queryClient.invalidateQueries({ queryKey: authQueryKeys.me() });
        },
        onError: () => {
            clearAuthToken();
        },
    });

    // ログアウト：サーバー通知 → トークン削除 → Query 破棄 → Store クリア
    const logoutMutation = useMutation({
        mutationKey: ['auth', 'logout'],
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearAuthToken();
            queryClient.removeQueries({ queryKey: authQueryKeys.me() });
            useAuthStore.getState().reset();
        },
        onError: () => {
            // ネットワーク失敗でもクライアント側は確実にログアウトさせる
            clearAuthToken();
            queryClient.removeQueries({ queryKey: authQueryKeys.me() });
            useAuthStore.getState().reset();
        },
    });

    return {
        user: authQuery.data ?? null,
        isAuthenticated: !!authQuery.data,
        isLoading: authQuery.isLoading || useAuthStore((s) => s.isInitializing),
        loginMutation,
        logoutMutation,
    };
};