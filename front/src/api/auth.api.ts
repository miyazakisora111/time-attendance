import { getAuth } from '@/__generated__/auth/auth';
import type { LoginResponse } from '@/__generated__/model/loginResponse';
import type { UserResponse } from '@/__generated__/model/userResponse';
import type { LogoutResponse } from '@/__generated__/model/logoutResponse';
import type { LoginRequest } from '@/__generated__/model';
import { call } from '@/lib/http/result';

const client = getAuth();

/** ユーザー情報を取得 */
export const fetchAuthMe = () => call<UserResponse>(() => client.getMe());

/** ログイン */
export const login = (payload: LoginRequest) => call<LoginResponse>(() => client.login(payload));

/** ログアウト */
export const logout = () => call<LogoutResponse>(() => client.logout());
