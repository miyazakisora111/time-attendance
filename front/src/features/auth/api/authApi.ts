import { getAuth } from '@/__generated__/auth/auth';
import type { LoginResponse } from '@/__generated__/model/loginResponse';
import type { UserResponse } from '@/__generated__/model/userResponse';
import type { LogoutApi200 } from '@/__generated__/model/logoutApi200';
import type { LoginRequest } from '@/__generated__/model';
import { call } from '@/shared/http/result';
import { toAuthUser } from '@/features/auth/adapters/toAuthUser';

const client = getAuth();

/** ユーザー情報を取得 */
export const me = () => call<UserResponse>(() => client.authMeApi()).then(toAuthUser);

/** ログイン */
export const login = (payload: LoginRequest) => call<LoginResponse>(() => client.loginApi(payload));

/** ログアウト */
export const logout = () => call<LogoutApi200>(() => client.logoutApi());
