import React from 'react';
import { Container } from '@/shared/components';
import { DataStateWrapper } from '@/shared/components/DataStateWrapper';
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
      <DataStateWrapper isLoading={isLoading}>
        <SettingsPresenter
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          handleSave={isSaving ? () => undefined : handleSave}
        />
      </DataStateWrapper>
    </Container>
  );
};

export default SettingsPage;
