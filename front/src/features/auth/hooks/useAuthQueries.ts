import { useQuery, useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchAuthMe, login, logout } from '@/api/auth.api';
import { toAuthUser } from '@/features/auth/adapters/toAuthUser';
import type { LoginResult } from '@/domain/auth/types';
import type { LogoutApi200 } from '@/__generated__/model/logoutApi200';
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
export const useAuthme = (
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
    options?: UseMutationOptions<LoginResult, Error, LoginRequest>,
) => useMutation({
    mutationKey: authQueryKeys.login(),
    mutationFn: (credentials: LoginRequest) => login(credentials),
    ...options,
});

/**
 * ログアウト
 */
export const useLogout = (
    options?: UseMutationOptions<LogoutApi200, Error, void>,
) => useMutation({
    mutationKey: authQueryKeys.logout(),
    mutationFn: () => logout(),
    ...options,
});