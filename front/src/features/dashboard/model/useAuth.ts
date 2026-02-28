import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authMeApi, loginApi, logoutApi, useAuthStore } from "@/features/auth";

export const authQueryKey = {
    all: ["auth"] as const,
    me: () => [...authQueryKey.all, "me"] as const,
};

export const useAuth = () => {
    const queryClient = useQueryClient();

    // 認証ユーザー取得
    const authQuery = useQuery({
        queryKey: authQueryKey.me(),
        queryFn: authMeApi,
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        onSuccess: (user) => {
            useAuthStore.getState().setUser(user);
            useAuthStore.getState().setIsAuthenticated(!!user);
            useAuthStore.getState().setIsInitializing(false);
        },
        onError: () => {
            useAuthStore.getState().setUser(null);
            useAuthStore.getState().setIsAuthenticated(false);
            useAuthStore.getState().setIsInitializing(false);
        },
    });

    // ログイン
    const login = useMutation({
        mutationFn: loginApi,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authQueryKey.me() });
        },
    });

    // ログアウト
    const logout = useMutation({
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
        login,
        logout,
    };
};
