import React from 'react';
import { Container } from '@/shared/components';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { SettingsPresenter } from '@/features/settings/ui/SettingsPresenter';

const SettingsPage: React.FC = () => {
  const { 
    activeSection, setActiveSection, 
    theme, setTheme, 
    language, setLanguage, 
    handleSave 
  } = useSettings();

  return (
    <Container size="full">
      <SettingsPresenter
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        handleSave={handleSave}
      />
    </Container>
  );
};

export default SettingsPage;
