import React from 'react';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const SettingsDrawer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="filters-content">
      {/* Language Switcher */}
      <LanguageSwitcher />
      {/* Disclaimer */}
      <div className="disclaimer" style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        {t('disclaimer')}
      </div>
    </div>
  );
};

export default SettingsDrawer;
