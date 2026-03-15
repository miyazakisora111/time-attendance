import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "@/api/__generated__/auth/auth";
import { useAuthStore } from "@/features/auth"; 
import { clearAuthToken, getAuthToken, setAuthToken } from "@/api/client";
import { QUERY_CONFIG } from "@/config/api";
import { unwrapApiEnvelope } from "@/shared/http/unwrapApiEnvelope";

/** 認証済みユーザー情報。 */
type AuthUser = {
    id: string;
    name: string;
    email: string;
    roles: string[];
    settings?: Record<string, unknown> | null;
    isAuthenticated?: boolean;
};

/** ログインAPIレスポンス。 */
type LoginResult = {
    token?: string;
    token_type?: string;
    expires_in?: number;
};

/**
 * 認証済みユーザー情報を取得する。
 */
const fetchAuthMe = async (): Promise<AuthUser> => {
    const response = await getAuth().authMeApi();
    const data = unwrapApiEnvelope<{ user: AuthUser }>(response);

    return data.user;
};

/**
 * ログアウトAPIを実行する。
 */
const logoutRequest = async (): Promise<void> => {
    await getAuth().logoutApi();
};

// React Queryキー管理
export const authQueryKey = {
    all: ["auth"] as const,
    me: () => [...authQueryKey.all, "me"] as const,
};

/**
 * 認証状態の取得とログイン/ログアウト処理を提供する hook。
 */
export const useAuth = () => {
    const queryClient = useQueryClient();
    const isInitializing = useAuthStore((state) => state.isInitializing);

    // 認証ユーザー取得
    const authQuery = useQuery({
        queryKey: authQueryKey.me(),
        queryFn: fetchAuthMe,
        enabled: !!getAuthToken(),
        retry: false,
        staleTime: QUERY_CONFIG.defaultStaleTimeMs,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (authQuery.isSuccess) {
            useAuthStore.getState().setUser(authQuery.data);
            useAuthStore.getState().setIsAuthenticated(true);
            useAuthStore.getState().setIsInitializing(false);
        } else if (authQuery.isError) {
            clearAuthToken();
            useAuthStore.getState().setUser(null);
            useAuthStore.getState().setIsAuthenticated(false);
            useAuthStore.getState().setIsInitializing(false);
        } else if (!getAuthToken()) {
            useAuthStore.getState().setIsInitializing(false);
        }
    }, [authQuery.isSuccess, authQuery.isError, authQuery.data]);

    // ログイン
    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await getAuth().loginApi(credentials);
            return unwrapApiEnvelope<LoginResult>(response);
        },

        onSuccess: async (result) => {
            if (result.token) {
                setAuthToken(result.token);
            }

            await queryClient.invalidateQueries({ queryKey: authQueryKey.me() });
        },
    });

    // ログアウト
    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: async () => {
            clearAuthToken();
            queryClient.removeQueries({ queryKey: authQueryKey.me() });
            useAuthStore.getState().setUser(null);
            useAuthStore.getState().setIsAuthenticated(false);
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
