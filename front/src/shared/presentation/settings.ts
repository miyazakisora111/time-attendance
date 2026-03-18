import type { SettingsSection } from '@/domain/settings/types';

export type SettingsThemeMode = 'light' | 'dark' | 'system';
export type SettingsNotificationKey = 'clock_missing' | 'approval' | 'leave_reminder';

export const DEFAULT_SETTINGS_LANGUAGE = '日本語';

export const settingsSections: ReadonlyArray<{
  id: SettingsSection;
  label: string;
}> = [
  { id: 'profile', label: 'プロフィール' },
  { id: 'notifications', label: '通知設定' },
  { id: 'security', label: 'セキュリティ' },
  { id: 'display', label: '表示設定' },
];

export const settingsThemeOptions: ReadonlyArray<{
  id: SettingsThemeMode;
  label: string;
}> = [
  { id: 'light', label: 'ライト' },
  { id: 'dark', label: 'ダーク' },
  { id: 'system', label: 'システム' },
];

export const settingsLanguageOptions = [
  DEFAULT_SETTINGS_LANGUAGE,
  'English',
  '简体中文',
  '繁體中文',
] as const;

export const settingsNotificationItems: ReadonlyArray<{
  id: SettingsNotificationKey;
  title: string;
  description: string;
}> = [
  {
    id: 'clock_missing',
    title: '打刻忘れ通知',
    description: '定時を過ぎても打刻がない場合に通知します',
  },
  {
    id: 'approval',
    title: '申請承認通知',
    description: '申請が承認または却下された場合に通知します',
  },
  {
    id: 'leave_reminder',
    title: '休暇リマインド',
    description: '取得予定の休暇の1日前に通知します',
  },
];

export const settingsSecurityActionLabels = [
  'パスワードの変更',
  'ログイン履歴の確認',
] as const;