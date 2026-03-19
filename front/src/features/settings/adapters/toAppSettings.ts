import type { SettingsResponse } from '@/__generated__/model';
import type { AppSettings } from '@/domain/settings/types';

/**
 * API レスポンスをアプリ設定型に変換する。
 */
export const toAppSettings = (response: SettingsResponse): AppSettings => ({
  profile: {
    name: response.profile.name,
    email: response.profile.email,
    department: response.profile.department,
    role: response.profile.role,
    employeeCode: response.profile.employeeCode,
  },
  notifications: {
    clockInReminder: response.notifications.clockInReminder,
    approvalNotification: response.notifications.approvalNotification,
    leaveReminder: response.notifications.leaveReminder,
  },
  security: {
    twoFactorEnabled: response.security.twoFactorEnabled,
    emailVerified: response.security.emailVerified,
    lastLoginAt: response.security.lastLoginAt ?? null,
    passwordLastChangedAt: response.security.passwordLastChangedAt ?? null,
  },
  theme: response.theme,
  language: response.language,
});
