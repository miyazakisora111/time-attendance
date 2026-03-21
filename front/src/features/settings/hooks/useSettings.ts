import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchSettings, updateSettings } from '@/features/settings/api/settingsApi';
import type {
  UpdateSettingsRequest,
  UpdateSettingsRequestNotifications,
  UpdateSettingsRequestProfile,
} from '@/__generated__/model';
import type { AppSettings, SettingsSection } from '@/domain/settings/types';
import { SETTINGS_SECTION } from '@/domain/settings/types';
import { ThemeType, LanguageCode } from '@/__generated__/enums';
import { DEFAULT_SETTINGS_LANGUAGE } from '@/shared/presentation/settings';

/**
 * React Query キー。
 */
const SCOPE = 'settings' as const;
const scoped = makeScopedKeys(SCOPE);
export const settingsQueryKeys = {
  all: () => scoped.all(),
  current: () => scoped.nest('current'),
  update: () => scoped.nest('update'),
} as const;

const buildDraftSettings = (settings?: AppSettings): UpdateSettingsRequest => ({
  profile: {
    name: settings?.profile.name ?? '',
    email: settings?.profile.email ?? '',
  },
  notifications: {
    clockInReminder: settings?.notifications.clockInReminder ?? true,
    approvalNotification: settings?.notifications.approvalNotification ?? true,
    leaveReminder: settings?.notifications.leaveReminder ?? true,
  },
  theme: settings?.theme ?? ThemeType.Light,
  language: settings?.language ?? DEFAULT_SETTINGS_LANGUAGE,
});

const createEmptySecurity = (): AppSettings['security'] => ({
  twoFactorEnabled: false,
  emailVerified: false,
  lastLoginAt: null,
  passwordLastChangedAt: null,
});

const createEmptyProfileView = () => ({
  name: '',
  email: '',
  department: '-',
  role: '-',
  employeeCode: '-',
});

/**
 * ユーザー設定を取得する hook。
 */
const useGetSettings = () => {
  return useQuery<AppSettings>({
    queryKey: settingsQueryKeys.current(),
    queryFn: fetchSettings,
  });
};

/**
 * ユーザー設定を更新する hook。
 */
const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: settingsQueryKeys.update(),
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(settingsQueryKeys.current(), data);
    },
  });
};

/**
 * 設定画面の状態を管理する composite hook。
 */
export const useSettings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>(SETTINGS_SECTION.Profile);
  const [draftSettings, setDraftSettings] = useState<UpdateSettingsRequest | null>(null);

  const settingsQuery = useGetSettings();
  const updateMutation = useUpdateSettings();

  const baseDraft = useMemo(
    () => buildDraftSettings(settingsQuery.data),
    [settingsQuery.data],
  );

  const editingSettings = draftSettings ?? baseDraft;

  const profile = useMemo(
    () => ({
      name: editingSettings.profile.name,
      email: editingSettings.profile.email,
      department: settingsQuery.data?.profile.department ?? createEmptyProfileView().department,
      role: settingsQuery.data?.profile.role ?? createEmptyProfileView().role,
      employeeCode: settingsQuery.data?.profile.employeeCode ?? createEmptyProfileView().employeeCode,
    }),
    [editingSettings.profile.email, editingSettings.profile.name, settingsQuery.data?.profile.department, settingsQuery.data?.profile.employeeCode, settingsQuery.data?.profile.role],
  );

  const notifications = useMemo(
    () => editingSettings.notifications,
    [editingSettings.notifications],
  );

  const theme = useMemo<ThemeType>(
    () => editingSettings.theme,
    [editingSettings.theme],
  );

  const language = useMemo<LanguageCode>(
    () => editingSettings.language,
    [editingSettings.language],
  );

  const security = useMemo(
    () => settingsQuery.data?.security ?? createEmptySecurity(),
    [settingsQuery.data?.security],
  );

  /**
   * テーマ更新ハンドラー。
   */
  const setTheme = (nextTheme: ThemeType) => {
    setDraftSettings((prev) => ({
      ...(prev ?? baseDraft),
      theme: nextTheme,
    }));
  };

  /**
   * 言語更新ハンドラー。
   */
  const setLanguage = (nextLanguage: LanguageCode) => {
    setDraftSettings((prev) => ({
      ...(prev ?? baseDraft),
      language: nextLanguage,
    }));
  };

  /**
   * プロフィール更新ハンドラー。
   */
  const setProfileField = (field: keyof UpdateSettingsRequestProfile, value: string) => {
    setDraftSettings((prev) => ({
      ...(prev ?? baseDraft),
      profile: {
        ...(prev?.profile ?? baseDraft.profile),
        [field]: value,
      },
    }));
  };

  /**
   * 通知設定更新ハンドラー。
   */
  const setNotification = (
    key: keyof UpdateSettingsRequestNotifications,
    value: boolean,
  ) => {
    setDraftSettings((prev) => ({
      ...(prev ?? baseDraft),
      notifications: {
        ...(prev?.notifications ?? baseDraft.notifications),
        [key]: value,
      },
    }));
  };

  /**
   * 編集内容を破棄してサーバー値へ戻す。
   */
  const handleReset = () => {
    setDraftSettings(null);
  };

  /**
   * 画面で編集中の設定を保存する。
   */
  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(editingSettings);

      setDraftSettings(null);

      sonner.success('設定を保存しました', {
        description: '変更内容は次回のログイン時にも適用されます。',
      });
    } catch {
      // エラー詳細は API 共通エラーハンドラーで表示する。
    }
  };

  return {
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    isSaving: updateMutation.isPending,
    hasData: settingsQuery.data != null,
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
    languageOptions: [LanguageCode.Ja, LanguageCode.En],
  };
};
