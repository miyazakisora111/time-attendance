import { useState } from 'react';
import { toast as sonner } from 'sonner';
import type { SettingsSection } from '@/domain/enums/settings';

export const useSettings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState('日本語');

  const handleSave = () => {
    sonner.success('設定を保存しました', {
      description: '変更内容は次回のログイン時にも適用されます。',
    });
  };

  return {
    activeSection,
    setActiveSection,
    theme,
    setTheme,
    language,
    setLanguage,
    handleSave,
  };
};
