import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchSettings, updateSettings } from '@/features/settings/api/settingsApi';
import { toAppSettings } from '@/features/settings/mappers/toAppSettings';
import type { SettingsResponse } from '@/__generated__/model';
import type { AppSettings } from '@/domain/settings/types';

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
 * ユーザー設定を取得する。
 */
export const useSettingsQuery = () =>
  useQuery<SettingsResponse, Error, AppSettings>({
    queryKey: settingsQueryKeys.current(),
    queryFn: fetchSettings,
    select: toAppSettings,
  });

/**
 * ユーザー設定を更新する。
 */
export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: settingsQueryKeys.update(),
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.current() });
    },
  });
};
