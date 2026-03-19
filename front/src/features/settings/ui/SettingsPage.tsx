import React from 'react';
import { Container } from '@/shared/components';
import { AsyncDataState } from '@/shared/components/AsyncDataState';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { SettingsPresenter } from '@/features/settings/ui/SettingsPresenter';

const SettingsPage: React.FC = () => {
  const {
    isLoading,
    isSaving,
    activeSection, setActiveSection, 
    theme, setTheme, 
    language, setLanguage, 
    handleSave 
  } = useSettings();

  return (
    <Container size="full">
      <AsyncDataState isLoading={isLoading}>
        <SettingsPresenter
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          handleSave={isSaving ? () => undefined : handleSave}
        />
      </AsyncDataState>
    </Container>
  );
};

export default SettingsPage;
