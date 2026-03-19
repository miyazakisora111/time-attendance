import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeScopedKeys } from '@/shared/react-query/keys';
import { fetchAuthMe, login, logout } from '@/api/auth.api';
import { useAuthStore } from '@/features/auth/hook/useAuthStore';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/shared/http/client';
import type { AuthUser, LoginResult } from '@/domain/auth/types';
import { QUERY_CONFIG } from '@/config/api';
import { toAuthUser } from '@/features/auth/adapters/toAuthUser';

/**
 * React Query キー。
 */
const SCOPE = 'auth' as const;
const scoped = makeScopedKeys(SCOPE);
export const authQueryKeys = {
    all: () => scoped.all(),
    me: () => scoped.nest('me'),
    login: () => scoped.nest('login'),
    logout: () => scoped.nest('logout'),
} as const;

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { setUser, setIsAuthenticated, setIsInitializing } = useAuthStore.getState();
    const isInitializing = useAuthStore((state) => state.isInitializing);
    const hasToken = !!getAuthToken();

    // /me クエリ：トークンがあるときだけ問い合わせ
    const authQuery = useQuery<AuthUser>({
        queryKey: authQueryKeys.me(),
        queryFn: () => fetchAuthMe().then(toAuthUser),
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
        mutationKey: authQueryKeys.login(),
        mutationFn: (credentials: { email: string; password: string }) => login(credentials),
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
        mutationKey: authQueryKeys.logout(),
        mutationFn: logout,
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
        isLoading: authQuery.isLoading || isInitializing,
        loginMutation,
        logoutMutation,
    };
};