/**
 * 認証関連のReact Queryカスタムフック
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '../../api/client';
import { useAuthStore } from '../../store';
import type { User, ApiResponse } from '../../types';

// キー定義
export const authQueryKeys = {
  all: ['auth'] as const,
  profile: () => [...authQueryKeys.all, 'profile'] as const,
  login: () => [...authQueryKeys.all, 'login'] as const,
};

// ログインミューテーション
export function useLoginMutation() {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setError = useAuthStore((state) => state.setError);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
        API_ENDPOINTS.auth.login,
        credentials
      );
      if (!response.success) {
        throw new Error(response.error || 'ログインに失敗しました');
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
        setError(null);
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'ログインに失敗しました';
      setError(message);
    },
  });
}

// ログアウトミューテーション
export function useLogoutMutation() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    },
    onSuccess: () => {
      logout();
    },
  });
}

// プロフィール取得クエリ
export function useProfileQuery() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: authQueryKeys.profile(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.auth.profile);
      if (!response.success) {
        throw new Error(response.error || 'プロフィール取得に失敗しました');
      }
      return response.data;
    },
    enabled: !!token,
  });
}

// トークンリフレッシュミューテーション
export function useRefreshTokenMutation() {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<{ token: string }>>(
        API_ENDPOINTS.auth.refresh
      );
      if (!response.success) {
        throw new Error(response.error || 'トークンリフレッシュに失敗しました');
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        setToken(data.token);
      }
    },
  });
}
