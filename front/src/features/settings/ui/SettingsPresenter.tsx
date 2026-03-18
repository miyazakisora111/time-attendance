import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Bell, Lock, Moon, Sun, Shield, Save, 
  ChevronRight, Monitor, SmartphoneNfc, Clock, AlertCircle, FileText, Calendar 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Typography, Label } from '@/shared/components';
import type { SettingsSection } from '@/domain/settings/types';
import {
  settingsLanguageOptions,
  settingsNotificationItems,
  settingsSections,
  settingsSecurityActionLabels,
  settingsThemeOptions,
  type SettingsNotificationKey,
  type SettingsThemeMode,
} from '@/shared/presentation/settings';

interface SettingsPresenterProps {
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;
  theme: SettingsThemeMode;
  setTheme: (theme: SettingsThemeMode) => void;
  language: string;
  setLanguage: (lang: string) => void;
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
  system: Monitor,
};

const settingsNotificationIconMap: Record<SettingsNotificationKey, LucideIcon> = {
  clock_missing: Clock,
  approval: FileText,
  leave_reminder: Calendar,
};

export const SettingsPresenter: React.FC<SettingsPresenterProps> = ({
  activeSection,
  setActiveSection,
  theme,
  setTheme,
  language,
  setLanguage,
  handleSave,
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="space-y-1">
            {settingsSections.map((section) => {
              const SectionIcon = settingsSectionIconMap[section.id];

              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "solid" : "ghost"}
                  intent={activeSection === section.id ? "primary" : "secondary"}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full justify-start gap-3 px-4 py-3 rounded-2xl h-auto"
                >
                  <SectionIcon size={18} />
                  <Typography variant="label" className={activeSection === section.id ? "text-white" : "text-gray-500"}>
                    {section.label}
                  </Typography>
                </Button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
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
                <Card variant="elevated" padding="none" className="overflow-hidden border-none shadow-md">
                  <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                       <User className="text-blue-600" size={20} />
                       プロフィール設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pb-6 border-b border-gray-50">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                          田
                        </div>
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md text-gray-400 hover:text-blue-600 transition-colors border border-gray-100 w-9 h-9"
                        >
                          <SmartphoneNfc size={16} />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <Typography variant="h3" className="font-bold text-lg text-gray-900">田中 太郎</Typography>
                        <Typography variant="small" intent="muted">営業部 / 正社員</Typography>
                        <Typography variant="small" intent="muted" className="text-xs">社員番号: EMP-2024001</Typography>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label><Typography variant="label">姓名</Typography></Label>
                        <input type="text" defaultValue="田中 太郎" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <Label><Typography variant="label">メールアドレス</Typography></Label>
                        <input type="email" defaultValue="t.tanaka@example.com" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
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
                <Card className="border-none shadow-sm rounded-3xl">
                  <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Bell className="text-blue-600" size={20} />
                      通知設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {settingsNotificationItems.map((item) => {
                      const ItemIcon = settingsNotificationIconMap[item.id];

                      return (
                        <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                            <ItemIcon size={20} />
                          </div>
                          <div>
                            <Typography variant="label">{item.title}</Typography>
                            <Typography variant="small" className="block text-gray-500">{item.description}</Typography>
                          </div>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
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
                <Card className="border-none shadow-sm rounded-3xl">
                  <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold">外観・表示設定</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                      <Label><Typography variant="label">テーマ設定</Typography></Label>
                      <div className="grid grid-cols-3 gap-4">
                        {settingsThemeOptions.map((option) => {
                          const ThemeIcon = settingsThemeIconMap[option.id];

                          return (
                            <Button
                              key={option.id}
                              variant={theme === option.id ? "solid" : "ghost"}
                              intent={theme === option.id ? "primary" : "secondary"}
                              onClick={() => setTheme(option.id)}
                              className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all h-auto"
                            >
                              <ThemeIcon size={24} />
                              <Typography variant="label" className={theme === option.id ? "text-white" : "text-gray-500"}>
                                {option.label}
                              </Typography>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label><Typography variant="label">使用言語</Typography></Label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        {settingsLanguageOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
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
                <Card className="border-none shadow-sm rounded-3xl">
                  <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Shield className="text-red-500" size={20} />
                      セキュリティ設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="text-red-500" size={20} />
                          <div>
                            <Typography variant="label" className="text-red-900">2要素認証が未設定です</Typography>
                            <Typography variant="small" className="text-red-700 block">アカウントの保護を強化するために設定を推奨します。</Typography>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                          設定する
                        </Button>
                      </div>

                      <div className="space-y-4 pt-4">
                        {settingsSecurityActionLabels.map((label) => (
                          <Button key={label} variant="outline" className="w-full justify-between h-14 rounded-2xl px-6 group">
                            <Typography variant="label">{label}</Typography>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button variant="ghost" className="rounded-xl">
              <Typography variant="label" className="text-gray-500">リセット</Typography>
            </Button>
            <Button 
              onClick={handleSave}
              variant="solid"
              intent="primary"
              className="px-8 h-12 rounded-xl shadow-lg shadow-blue-100 gap-2"
            >
              <Save size={18} />
              <Typography variant="label">変更を保存</Typography>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
