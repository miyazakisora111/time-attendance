/**
 * テーマ定数。
 */
export const THEME = {
  Light: 'light',
  Dark: 'dark',
} as const;

/**
 * テーマ型。
 */
export type Theme = typeof THEME[keyof typeof THEME];

/**
 * 言語定数。
 */
export const LANGUAGE = {
  Ja: 'ja',
  En: 'en',
} as const;

/**
 * 言語型。
 */
export type Language = typeof LANGUAGE[keyof typeof LANGUAGE];

/**
 * プロフィール設定。
 */
export interface AppSettingsProfile {
  name: string;
  email: string;
  department: string;
  role: string;
  employeeCode: string;
}

/**
 * 通知設定。
 */
export interface AppSettingsNotifications {
  clockInReminder: boolean;
  approvalNotification: boolean;
  leaveReminder: boolean;
}

/**
 * セキュリティ設定。
 */
export interface AppSettingsSecurity {
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  passwordLastChangedAt: string | null;
}

/**
 * ユーザー設定。
 */
export interface AppSettings {
  profile: AppSettingsProfile;
  notifications: AppSettingsNotifications;
  security: AppSettingsSecurity;
  theme: Theme;
  language: Language;
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
