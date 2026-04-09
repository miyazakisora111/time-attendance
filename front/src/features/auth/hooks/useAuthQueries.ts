import { useQuery, useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchAuthMe, login, logout } from '@/api/auth.api';
import { toAuthUser } from '@/features/auth/assemblers/toAuthUser';
import type { LoginResponse } from '@/__generated__/model/loginResponse';
import type { LogoutResponse } from '@/__generated__/model/logoutResponse';
import type { LoginRequest } from '@/__generated__/model';

/**
 * React Query キー。
 */
const SCOPE = 'auth' as const;
const scoped = makeScopedKeys(SCOPE);
export const authQueryKeys = {
    all: () => scoped.all(),
    authMe: () => scoped.nest('authMe'),
    login: () => scoped.nest('login'),
    logout: () => scoped.nest('logout'),
} as const;

/**
 * 認証ユーザー
 */
export const useAuthMe = (
    enabled: boolean,
) => useQuery({
    queryKey: authQueryKeys.authMe(),
    queryFn: fetchAuthMe,
    select: (data) => toAuthUser(data),
    enabled,
});

/**
 * ログイン
 */
export const useLogin = (
    options?: UseMutationOptions<LoginResponse, Error, LoginRequest>,
) => useMutation({
    mutationKey: authQueryKeys.login(),
    mutationFn: (credentials: LoginRequest) => login(credentials),
    ...options,
});

/**
 * ログアウト
 */
export const useLogout = (
    options?: UseMutationOptions<LogoutResponse, Error, void>,
) => useMutation({
    mutationKey: authQueryKeys.logout(),
    mutationFn: () => logout(),
    ...options,
});