import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authMeApi, loginApi, logoutApi } from '../api/api';

export const useAuth = () => {
    const queryClient = useQueryClient();

    const authQuery = useQuery({
        queryKey: authQueryKey.me(),
        queryFn: authMeApi,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const login = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            queryClient.setQueryData(authQueryKey.me(), data.user);
        },
    });

    const logout = useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            queryClient.setQueryData(authQueryKey.me(), null);
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

