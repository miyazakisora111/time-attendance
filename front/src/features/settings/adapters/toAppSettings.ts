import type { SettingsResponse } from '@/__generated__/model';
import type { AppSettings } from '@/domain/settings/types';

/**
 * API レスポンスをアプリ設定型に変換する。
 */
export const toAppSettings = (response: SettingsResponse): AppSettings => ({
  language: response.language,
  theme: response.theme as AppSettings['theme'],
});
