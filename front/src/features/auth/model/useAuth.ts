import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "@/api/__generated__/auth/auth"; 
import { useAuthStore } from "@/features/auth"; 
import { clearAuthToken, getAuthToken, setAuthToken } from "@/api/client";

type ApiEnvelope<T> = {
    success: boolean;
    message: string;
    data: T;
};

type AuthUser = {
    id: string;
    name: string;
    email: string;
    roles: string[];
    settings?: Record<string, unknown> | null;
    isAuthenticated?: boolean;
};

type LoginResult = {
    token?: string;
    token_type?: string;
    expires_in?: number;
};

const unwrapResponse = <T>(payload: T | ApiEnvelope<T>): T => {
    if (
        payload &&
        typeof payload === "object" &&
        "data" in payload &&
        "success" in payload
    ) {
        return (payload as ApiEnvelope<T>).data;
    }

    return payload as T;
};

const fetchAuthMe = async (): Promise<AuthUser> => {
    const response = await getAuth().authMeApi();
    const data = unwrapResponse<{ user: AuthUser }>(response);

    return data.user;
};

const logoutRequest = async (): Promise<void> => {
    await getAuth().logoutApi();
};

// React Queryキー管理
export const authQueryKey = {
    all: ["auth"] as const,
    me: () => [...authQueryKey.all, "me"] as const,
};

export const useAuth = () => {
    const queryClient = useQueryClient();

    // 認証ユーザー取得
    const authQuery = useQuery({
        queryKey: authQueryKey.me(),
        queryFn: fetchAuthMe,
        enabled: !!getAuthToken(),
        retry: false,
        staleTime: 1000 * 60 * 5,
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
            return unwrapResponse<LoginResult>(response);
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
        isLoading: authQuery.isLoading || useAuthStore((state) => state.isInitializing),
        loginMutation,
        logoutMutation,
    };
};
