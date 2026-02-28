import { httpClient } from '@/lib/http-client';
import { toResult } from '@/shared/http/toResult';
import type { Result } from '@/shared/http/types/result';
import type {
  LoginRequest,
  LoginResponse,
  AuthMeResponse,
  LogoutResponse,
  RegisterRequest,
} from '@/features/auth';

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
  toResult(() =>
    httpClient.post<LogoutResponse>(
      `${AUTH_BASE_URL}/logout`
    )
  );

/**
 * 現在ユーザー確認
 */
export const authMeApi = (): Promise<Result<AuthMeResponse, Error>> =>
  toResult(() =>
    httpClient.get<AuthMeResponse>(
      `${AUTH_BASE_URL}/me`
    )
  );

/**
 * ユーザー登録
 */
export const registerApi = (
  payload: RegisterRequest
): Promise<Result<LoginResponse, Error>> =>
  toResult(() =>
    httpClient.post<LoginResponse>(
      `${AUTH_BASE_URL}/register`,
      payload
    )
  );

/**
 * CSRFトークン取得
 */
export const getCsrfTokenApi = (): Promise<Result<void, Error>> =>
  toResult(() => httpClient.getCsrfToken());
