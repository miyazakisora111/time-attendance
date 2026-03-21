import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Monitor,
  Moon,
  Save,
  Shield,
  Sun,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Label, Typography } from '@/shared/components';
import { inputVariants } from '@/shared/design-system/variants/input';
import { stack } from '@/shared/design-system/layout';
import type { AppSettingsNotifications, AppSettingsSecurity, SettingsSection } from '@/domain/settings/types';
import type { UpdateSettingsRequestProfile } from '@/__generated__/model';
import {
  settingsLanguageOptions,
  settingsNotificationItems,
  settingsSections,
  settingsThemeOptions,
  type SettingsLanguageCode,
  type SettingsNotificationKey,
  type SettingsThemeMode,
} from '@/shared/presentation/settings';

type SettingsProfileView = Pick<UpdateSettingsRequestProfile, 'name' | 'email'> & {
  department: string;
  role: string;
  employeeCode: string;
};

interface SettingsPresenterProps {
  isSaving: boolean;
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;
  profile: SettingsProfileView;
  setProfileField: (field: keyof UpdateSettingsRequestProfile, value: string) => void;
  notifications: AppSettingsNotifications;
  setNotification: (key: SettingsNotificationKey, value: boolean) => void;
  security: AppSettingsSecurity;
  theme: SettingsThemeMode;
  setTheme: (theme: SettingsThemeMode) => void;
  language: SettingsLanguageCode;
  setLanguage: (lang: SettingsLanguageCode) => void;
  handleReset: () => void;
  handleSave: () => void;
}

const settingsSectionIconMap: Record<SettingsSection, LucideIcon> = {
  profile: User,
  notifications: Bell,
  security: Lock,
  display: Monitor,
};

const settingsThemeIconMap: Record<SettingsThemeMode, LucideIcon> = {
  light: Sun,
  dark: Moon,
};

const settingsNotificationIconMap: Record<SettingsNotificationKey, LucideIcon> = {
  clockInReminder: Clock,
  approvalNotification: FileText,
  leaveReminder: Calendar,
};

const formatDateTime = (value?: string | null): string => {
  if (!value) {
    return '未記録';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '未記録';
  }

  return date.toLocaleString('ja-JP');
};

export const SettingsPresenter: React.FC<SettingsPresenterProps> = ({
  isSaving,
  activeSection,
  setActiveSection,
  profile,
  setProfileField,
  notifications,
  setNotification,
  security,
  theme,
  setTheme,
  language,
  setLanguage,
  handleReset,
  handleSave,
}) => {
  const profileInitial = profile.name.trim().charAt(0) || 'U';

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-64">
          <div className={stack.xs}>
            {settingsSections.map((section) => {
              const SectionIcon = settingsSectionIconMap[section.id];

              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'solid' : 'ghost'}
                  intent={activeSection === section.id ? 'primary' : 'secondary'}
                  onClick={() => setActiveSection(section.id)}
                  unstableClassName="h-auto w-full justify-start gap-3 rounded-2xl px-4 py-3"
                >
                  <SectionIcon size={18} />
                  <Typography
                    variant="label"
                    intent={activeSection === section.id ? 'white' : 'muted'}
                  >
                    {section.label}
                  </Typography>
                </Button>
              );
            })}
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card variant="elevated" padding="none" unstableClassName="overflow-hidden border-none shadow-md">
                  <CardHeader unstableClassName="border-b border-gray-100 bg-gray-50/50 p-8">
                    <CardTitle unstableClassName="flex items-center gap-2 text-xl font-bold">
                      <User className="text-blue-600" size={20} />
                      プロフィール設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent unstableClassName="space-y-6 p-8">
                    <div className="flex flex-col items-start gap-8 border-b border-gray-50 pb-6 md:flex-row md:items-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white shadow-xl">
                        {profileInitial}
                      </div>
                      <div className="space-y-1">
                        <Typography variant="h3" unstableClassName="text-lg font-bold text-gray-900">
                          {profile.name || '-'}
                        </Typography>
                        <Typography variant="small" intent="muted">
                          {profile.department} / {profile.role}
                        </Typography>
                        <Typography variant="small" intent="muted" unstableClassName="text-xs">
                          社員番号: {profile.employeeCode}
                        </Typography>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>
                          <Typography variant="label">姓名</Typography>
                        </Label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(event) => setProfileField('name', event.target.value)}
                          className={inputVariants({ variant: 'filled' })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          <Typography variant="label">メールアドレス</Typography>
                        </Label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(event) => setProfileField('email', event.target.value)}
                          className={inputVariants({ variant: 'filled' })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card unstableClassName="rounded-3xl border-none shadow-sm">
                  <CardHeader unstableClassName="border-b border-gray-100 p-8">
                    <CardTitle unstableClassName="flex items-center gap-2 text-xl font-bold">
                      <Bell className="text-blue-600" size={20} />
                      通知設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent unstableClassName="space-y-6 p-8">
                    {settingsNotificationItems.map((item) => {
                      const ItemIcon = settingsNotificationIconMap[item.id];

                      return (
                        <div key={item.id} className="flex items-center justify-between border-b border-gray-50 py-4 last:border-none">
                          <div className="flex items-center gap-4">
                            <div className="rounded-2xl bg-gray-50 p-3 text-gray-400">
                              <ItemIcon size={20} />
                            </div>
                            <div>
                              <Typography variant="label">{item.title}</Typography>
                              <Typography variant="small" unstableClassName="block text-gray-500">
                                {item.description}
                              </Typography>
                            </div>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={notifications[item.id]}
                              onChange={(event) => setNotification(item.id, event.target.checked)}
                              className="peer sr-only"
                            />
                            <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white" />
                          </label>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'display' && (
              <motion.div
                key="display"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card unstableClassName="rounded-3xl border-none shadow-sm">
                  <CardHeader unstableClassName="border-b border-gray-100 p-8">
                    <CardTitle unstableClassName="text-xl font-bold">外観・表示設定</CardTitle>
                  </CardHeader>
                  <CardContent unstableClassName="space-y-8 p-8">
                    <div className="space-y-4">
                      <Label>
                        <Typography variant="label">テーマ設定</Typography>
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        {settingsThemeOptions.map((option) => {
                          const ThemeIcon = settingsThemeIconMap[option.id];

                          return (
                            <Button
                              key={option.id}
                              variant={theme === option.id ? 'solid' : 'ghost'}
                              intent={theme === option.id ? 'primary' : 'secondary'}
                              onClick={() => setTheme(option.id)}
                              unstableClassName="h-auto flex-col items-center gap-3 rounded-2xl border-2 p-4"
                            >
                              <ThemeIcon size={24} />
                              <Typography
                                variant="label"
                                intent={theme === option.id ? 'white' : 'muted'}
                              >
                                {option.label}
                              </Typography>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>
                        <Typography variant="label">使用言語</Typography>
                      </Label>
                      <select
                        value={language}
                        onChange={(event) => setLanguage(event.target.value as SettingsLanguageCode)}
                        className={inputVariants({ variant: 'filled' })}
                      >
                        {settingsLanguageOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card unstableClassName="rounded-3xl border-none shadow-sm">
                  <CardHeader unstableClassName="border-b border-gray-100 p-8">
                    <CardTitle unstableClassName="flex items-center gap-2 text-xl font-bold">
                      <Shield className="text-red-500" size={20} />
                      セキュリティ設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent unstableClassName="space-y-6 p-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-gray-100 bg-white p-4">
                        <Typography variant="small" intent="muted">メール認証</Typography>
                        <div className="mt-2 flex items-center gap-2">
                          {security.emailVerified ? (
                            <CheckCircle2 size={18} className="text-green-600" />
                          ) : (
                            <AlertCircle size={18} className="text-amber-600" />
                          )}
                          <Typography variant="label">
                            {security.emailVerified ? '認証済み' : '未認証'}
                          </Typography>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-white p-4">
                        <Typography variant="small" intent="muted">2要素認証</Typography>
                        <div className="mt-2 flex items-center gap-2">
                          {security.twoFactorEnabled ? (
                            <CheckCircle2 size={18} className="text-green-600" />
                          ) : (
                            <AlertCircle size={18} className="text-amber-600" />
                          )}
                          <Typography variant="label">
                            {security.twoFactorEnabled ? '有効' : '未設定'}
                          </Typography>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-white p-4">
                        <Typography variant="small" intent="muted">最終ログイン</Typography>
                        <Typography variant="label" unstableClassName="mt-2 block">
                          {formatDateTime(security.lastLoginAt)}
                        </Typography>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-white p-4">
                        <Typography variant="small" intent="muted">パスワード最終変更</Typography>
                        <Typography variant="label" unstableClassName="mt-2 block">
                          {formatDateTime(security.passwordLastChangedAt)}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-end gap-3 pt-6">
            <Button variant="ghost" onClick={handleReset} disabled={isSaving}>
              <Typography variant="label" intent="muted">リセット</Typography>
            </Button>
            <Button
              onClick={handleSave}
              variant="solid"
              intent="primary"
              unstableClassName="h-12 gap-2 rounded-xl px-8 shadow-lg shadow-blue-100"
              disabled={isSaving}
            >
              <Save size={18} />
              <Typography variant="label">{isSaving ? '保存中...' : '変更を保存'}</Typography>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
