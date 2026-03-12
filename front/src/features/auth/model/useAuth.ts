import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "@/api/__generated__/auth/auth"; 
import { useAuthStore } from "@/features/auth"; 
import { z } from "zod";

// TODO: APIクライアントの実装に合わせて修正
// mock authMeApi
const authMeApi = async () => ({ id: "1", name: "User", email: "user@example.com" });
// mock logoutApi
const logoutApi = async () => ({ success: true });
// mock AuthMeSchema
const AuthMeSchema = z.object({ id: z.string(), name: z.string(), email: z.string() });

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
        queryFn: async () => {
            const data = await authMeApi();
            // Zodで型チェック
            return AuthMeSchema.parse(data);
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (authQuery.isSuccess) {
            useAuthStore.getState().setUser(authQuery.data as any);
            useAuthStore.getState().setIsAuthenticated(true);
            useAuthStore.getState().setIsInitializing(false);
        } else if (authQuery.isError) {
            useAuthStore.getState().setUser(null);
            useAuthStore.getState().setIsAuthenticated(false);
            useAuthStore.getState().setIsInitializing(false);
        }
    }, [authQuery.isSuccess, authQuery.isError, authQuery.data]);

    // ログイン
    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const data = await loginApi(credentials);
            return data;
        },

        onSuccess: async () => {
            // ログイン成功後は認証情報を再フェッチ
            await queryClient.invalidateQueries({ queryKey: authQueryKey.me() });
        },
    });

    // ログアウト
    const logoutMutation = useMutation({
        mutationFn: logoutApi,
        onSuccess: async () => {
            queryClient.removeQueries({ queryKey: authQueryKey.me() });
            useAuthStore.getState().setUser(null);
            useAuthStore.getState().setIsAuthenticated(false);
        },
    });

    return {
        user: authQuery.data ?? null,
        isAuthenticated: !!authQuery.data,
        isLoading: authQuery.isLoading,
        loginMutation,
        logoutMutation,
    };
};
