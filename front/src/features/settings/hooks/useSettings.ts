import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';
import { makeScopedKeys } from '@/shared/react-query/keys';
import { fetchSettings, updateSettings } from '@/features/settings/api/settingsApi';
import { UpdateSettingsRequestTheme, type UpdateSettingsRequest } from '@/__generated__/model';
import type { AppSettings, SettingsSection } from '@/domain/settings/types';
import { SETTINGS_SECTION, THEME } from '@/domain/settings/types';
import { QUERY_CONFIG } from '@/config/api';
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

/**
 * ユーザー設定を取得する hook。
 */
const useGetSettings = () => {
  return useQuery<AppSettings>({
    queryKey: settingsQueryKeys.current(),
    queryFn: fetchSettings,
    staleTime: QUERY_CONFIG.defaultStaleTimeMs,
    refetchOnWindowFocus: false,
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

  const theme = useMemo<typeof THEME[keyof typeof THEME]>(
    () => (draftSettings?.theme as typeof THEME[keyof typeof THEME]) ?? settingsQuery.data?.theme ?? THEME.System,
    [draftSettings?.theme, settingsQuery.data?.theme],
  );

  const language = useMemo(
    () => draftSettings?.language ?? settingsQuery.data?.language ?? DEFAULT_SETTINGS_LANGUAGE,
    [draftSettings?.language, settingsQuery.data?.language],
  );

  /**
   * テーマ更新ハンドラー。
   */
  const setTheme = (nextTheme: typeof THEME[keyof typeof THEME]) => {
    setDraftSettings((prev) => ({
      theme: UpdateSettingsRequestTheme[nextTheme as keyof typeof UpdateSettingsRequestTheme],
      language: prev?.language ?? settingsQuery.data?.language ?? DEFAULT_SETTINGS_LANGUAGE,
    }));
  };

  /**
   * 言語更新ハンドラー。
   */
  const setLanguage = (nextLanguage: string) => {
    setDraftSettings((prev) => ({
      theme: prev?.theme ?? UpdateSettingsRequestTheme[settingsQuery.data?.theme ?? THEME.Light],
      language: nextLanguage,
    }));
  };

  /**
   * 画面で編集中の設定を保存する。
   */
  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        theme: UpdateSettingsRequestTheme[theme as keyof typeof UpdateSettingsRequestTheme],
        language,
      });

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
    isSaving: updateMutation.isPending,
    activeSection,
    setActiveSection,
    theme,
    setTheme,
    language,
    setLanguage,
    handleSave,
  };
};
