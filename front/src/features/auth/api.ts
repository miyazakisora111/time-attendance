/**
 * 認証フィーチャー - API 関数
 * 
 * 責務:
 * - HTTP 通信を httpClient 経由で実行
 * - APIレスポンスを型チェック
 * - TanStack Query と統合
 * 
 * ⚠️ 禁止: ストア更新、ローカルストレージ
 */

import { httpClient, type ApiResponse } from '@/lib';
import type {
  LoginRequest,
  LoginResponse,
  AuthMeResponse,
  LogoutResponse,
  RegisterRequest,
} from './types';

const AUTH_BASE_URL = '/auth';

/**
 * ログイン API
 * POST /auth/login
 */
export async function apiLogin(
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  return httpClient.post<LoginResponse>(
    `${AUTH_BASE_URL}/login`,
    credentials
  );
}

/**
 * ログアウト API
 * POST /auth/logout
 */
export async function apiLogout(): Promise<ApiResponse<LogoutResponse>> {
  return httpClient.post<LogoutResponse>(`${AUTH_BASE_URL}/logout`);
}

/**
 * 現在のユーザー確認 API
 * GET /auth/me
 * 
 * ページリロード時にセッションを確認する
 * Sanctum Cookie ベース認証に対応
 */
export async function apiAuthMe(): Promise<ApiResponse<AuthMeResponse>> {
  return httpClient.get<AuthMeResponse>(`${AUTH_BASE_URL}/me`);
}

/**
 * ユーザー登録 API
 * POST /auth/register
 */
export async function apiRegister(
  data: RegisterRequest
): Promise<ApiResponse<LoginResponse>> {
  return httpClient.post<LoginResponse>(
    `${AUTH_BASE_URL}/register`,
    data
  );
}

/**
 * CSRF トークン取得
 * POST /sanctum/csrf-cookie
 * 
 * Sanctum の setup step
 * 本来はフロント初期化時に1度だけ呼び出す
 */
export async function apiGetCsrfToken(): Promise<void> {
  await httpClient.getRawInstance().get('/sanctum/csrf-cookie');
}
