import { httpClient } from '@/lib/axios/client';
import { toResult } from '@/shared/http/toResult';
import type { Result } from '@/shared/http/types/result';
import type { ApiResponse } from '@/shared/http/types/api';
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
): Promise<Result<LoginResponse, Error>> =>
  toResult(() =>
    httpClient.post<LoginResponse>(
      `${AUTH_BASE_URL}/login`,
      credentials
    )
  );

/**
 * ログアウト
 */
export const logoutApi = (): Promise<Result<LogoutResponse, Error>> =>
  toResult(async () => {
    const res = await httpClient.post<ApiResponse<LogoutResponse>>(
      `${AUTH_BASE_URL}/logout`
    );

    return res.data.data;
  });

/**
 * 現在ユーザー確認
 */
export const authMeApi = (): Promise<Result<AuthMeResponse, Error>> =>
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
): Promise<Result<LoginResponse, Error>> =>
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
export const getCsrfTokenApi = (): Promise<Result<void, Error>> =>
  toResult(async () => {
    await httpClient.getCsrfToken();
  });
