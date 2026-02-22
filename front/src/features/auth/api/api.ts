import { httpClient } from '@/shared/lib/http/httpClient';
import { toResult } from '@/shared/lib/result/toResult';
import type { Result } from '@/shared/lib/result/result';
import type { ApiResponse } from '@/shared/types/api';
import type {
  LoginRequest,
  LoginResponse,
  AuthMeResponse,
  LogoutResponse,
  RegisterRequest,
} from '../model/types';

const AUTH_BASE_URL = '/auth';

/**
 * ログイン
 */
export const loginApi = (
  credentials: LoginRequest
): Promise<Result<LoginResponse>> =>
  toResult(async () => {
    const res = await httpClient.post<ApiResponse<LoginResponse>>(
      `${AUTH_BASE_URL}/login`,
      credentials
    );

    return res.data.data;
  });

/**
 * ログアウト
 */
export const logoutApi = (): Promise<Result<LogoutResponse>> =>
  toResult(async () => {
    const res = await httpClient.post<ApiResponse<LogoutResponse>>(
      `${AUTH_BASE_URL}/logout`
    );

    return res.data.data;
  });

/**
 * 現在ユーザー確認
 */
export const authMeApi = (): Promise<Result<AuthMeResponse>> =>
  toResult(async () => {
    const res = await httpClient.get<ApiResponse<AuthMeResponse>>(
      `${AUTH_BASE_URL}/me`
    );

    return res.data.data;
  });

/**
 * ユーザー登録
 */
export const registerApi = (
  payload: RegisterRequest
): Promise<Result<LoginResponse>> =>
  toResult(async () => {
    const res = await httpClient.post<ApiResponse<LoginResponse>>(
      `${AUTH_BASE_URL}/register`,
      payload
    );

    return res.data.data;
  });

/**
 * CSRF取得
 */
export const getCsrfTokenApi = (): Promise<Result<void>> =>
  toResult(async () => {
    await httpClient.getCsrfToken();
  });
