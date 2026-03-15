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
