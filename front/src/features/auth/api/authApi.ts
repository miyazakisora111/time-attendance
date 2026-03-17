import { getAuth } from '@/__generated__/auth/auth';
import { unwrapApiEnvelope } from '@/shared/http/result/envelope';
import type { AuthUser, LoginResult } from '@/domain/auth/types';

export const authQueryKeys = {
  all: ['auth'] as const,
  me: () => [...authQueryKeys.all, 'me'] as const,
};

export const authApi = {
    async me(): Promise<AuthUser> {
        const resp = await getAuth().authMeApi();
        const data = unwrapApiEnvelope<{ user: AuthUser }>(resp);
        return data.user;
    },

    async login(credentials: { email: string; password: string }): Promise<LoginResult> {
        const resp = await getAuth().loginApi(credentials);
        return unwrapApiEnvelope<LoginResult>(resp);
    },

    async logout(): Promise<void> {
        await getAuth().logoutApi();
    },
};