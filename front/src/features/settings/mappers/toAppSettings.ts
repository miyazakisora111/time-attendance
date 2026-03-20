import type { SettingsResponse } from '@/__generated__/model';
import type { AppSettings } from '@/domain/settings/types';
import type { Mapper } from "@/shared/mapper/types";

export const toAppSettings: Mapper<SettingsResponse, AppSettings> = (response) => ({
  ...response,
  security: {
    ...response.security,
    lastLoginAt: response.security.lastLoginAt ?? null,
    passwordLastChangedAt: response.security.passwordLastChangedAt ?? null,
  },
});


