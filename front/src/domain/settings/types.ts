/**
 * テーマ定数。
 */
export const THEME = {
  Light: 'light',
  Dark: 'dark',
  System: 'system',
} as const;

/**
 * テーマ型。
 */
export type Theme = typeof THEME[keyof typeof THEME];

/**
 * ユーザー設定。
 */
export interface AppSettings {
  language: string;
  theme: Theme;
}

/**
 * 設定画面セクション定数。
 */
export const SETTINGS_SECTION = {
  Profile: 'profile',
  Notifications: 'notifications',
  Display: 'display',
  Security: 'security',
} as const;

/**
 * 設定画面セクション型。
 */
export type SettingsSection = typeof SETTINGS_SECTION[keyof typeof SETTINGS_SECTION];
