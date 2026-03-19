import React from 'react';
import { Container } from '@/shared/components';
import { AsyncDataState } from '@/shared/components/states/AsyncDataState';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { SettingsPresenter } from '@/features/settings/ui/SettingsPresenter';

const SettingsPage: React.FC = () => {
  const {
    isLoading,
    isError,
    isSaving,
    hasData,
    activeSection, setActiveSection, 
    profile,
    setProfileField,
    notifications,
    setNotification,
    security,
    theme, setTheme, 
    language, setLanguage, 
    handleReset,
    handleSave 
  } = useSettings();

  return (
    <Container size="full">
      <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={!hasData}>
        <SettingsPresenter
          isSaving={isSaving}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          profile={profile}
          setProfileField={setProfileField}
          notifications={notifications}
          setNotification={setNotification}
          security={security}
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          handleReset={handleReset}
          handleSave={isSaving ? () => undefined : handleSave}
        />
      </AsyncDataState>
    </Container>
  );
};

export default SettingsPage;
