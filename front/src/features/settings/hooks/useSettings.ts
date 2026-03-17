import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';
import { getSettings } from '@/__generated__/settings/settings';
import { UpdateSettingsRequestTheme, type SettingsResponse, type UpdateSettingsRequest } from '@/__generated__/model';
import type { SettingsSection } from '@/domain/entities/settings';
import { SETTINGS_SECTION } from '@/domain/entities/settings';
import { unwrapApiEnvelope } from '@/shared/http/unwrapApiEnvelope';
import { DEFAULT_SETTINGS_LANGUAGE } from '@/shared/presentation/settings';

/** 設定 Query Key。 */
const SETTINGS_QUERY_KEY = ['settings'] as const;

/**
 * 設定取得 API。
 */
const fetchSettings = async (): Promise<SettingsResponse> => {
  const response = await getSettings().getSettingsApi();

  return unwrapApiEnvelope<SettingsResponse>(response);
};

/**
 * 設定更新 API。
 */
const saveSettings = async (payload: UpdateSettingsRequest): Promise<SettingsResponse> => {
  const response = await getSettings().updateSettingsApi(payload);

  return unwrapApiEnvelope<SettingsResponse>(response);
};

/**
 * 設定画面の状態を管理する hook。
 */
export const useSettings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>(SETTINGS_SECTION.Profile);
  const [draftSettings, setDraftSettings] = useState<UpdateSettingsRequest | null>(null);

  const settingsQuery = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: fetchSettings,
  });

  const updateMutation = useMutation({
    mutationFn: saveSettings,
  });

  const theme = useMemo<'light' | 'dark' | 'system'>(
    () => draftSettings?.theme ?? settingsQuery.data?.theme ?? 'light',
    [draftSettings?.theme, settingsQuery.data?.theme],
  );

  const language = useMemo(
    () => draftSettings?.language ?? settingsQuery.data?.language ?? DEFAULT_SETTINGS_LANGUAGE,
    [draftSettings?.language, settingsQuery.data?.language],
  );

  /** テーマ更新ハンドラー。 */
  const setTheme = (nextTheme: 'light' | 'dark' | 'system') => {
    setDraftSettings((prev) => ({
      theme: UpdateSettingsRequestTheme[nextTheme],
      language: prev?.language ?? settingsQuery.data?.language ?? DEFAULT_SETTINGS_LANGUAGE,
    }));
  };

  /** 言語更新ハンドラー。 */
  const setLanguage = (nextLanguage: string) => {
    setDraftSettings((prev) => ({
      theme: prev?.theme ?? UpdateSettingsRequestTheme[settingsQuery.data?.theme ?? 'light'],
      language: nextLanguage,
    }));
  };

  /**
   * 画面で編集中の設定を保存する。
   */
  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        theme: UpdateSettingsRequestTheme[theme],
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
