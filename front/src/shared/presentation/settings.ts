import type { AppSettingsNotifications, SettingsSection } from '@/domain/settings/types';
import type { ThemeType, LanguageCode } from '@/__generated__/enums';

export type SettingsThemeMode = ThemeType;
export type SettingsLanguageCode = LanguageCode;
export type SettingsNotificationKey = keyof AppSettingsNotifications;

export const DEFAULT_SETTINGS_LANGUAGE: SettingsLanguageCode = 'ja';

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
  ];

export const settingsLanguageOptions: ReadonlyArray<{ value: SettingsLanguageCode; label: string }> = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

export const settingsNotificationItems: ReadonlyArray<{
  id: SettingsNotificationKey;
  title: string;
  description: string;
}> = [
    {
      id: 'clockInReminder',
      title: '打刻忘れ通知',
      description: '定時を過ぎても打刻がない場合に通知します',
    },
    {
      id: 'approvalNotification',
      title: '申請承認通知',
      description: '申請が承認または却下された場合に通知します',
    },
    {
      id: 'leaveReminder',
      title: '休暇リマインド',
      description: '取得予定の休暇の1日前に通知します',
    },
  ];

export const settingsSecurityActionLabels = [
  'パスワードの変更',
  'ログイン履歴の確認',
] as const;