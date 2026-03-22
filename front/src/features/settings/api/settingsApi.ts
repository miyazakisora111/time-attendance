import { getSettings } from '@/__generated__/settings/settings';
import type { SettingsResponse, UpdateSettingsRequest } from '@/__generated__/model';
import { call } from '@/lib/http/result';

const client = getSettings();

/** ユーザー設定を取得 */
export const fetchSettings = () =>
  call<SettingsResponse>(() => client.getSettingsApi());

/** ユーザー設定を更新 */
export const updateSettings = (payload: UpdateSettingsRequest) =>
  call<SettingsResponse>(() => client.updateSettingsApi(payload));
