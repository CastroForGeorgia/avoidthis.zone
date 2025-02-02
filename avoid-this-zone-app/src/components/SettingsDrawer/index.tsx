import React from 'react';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Card, List } from 'antd';

// Define community resources with translation keys
const communityResources = [
  {
    key: 'glaHotline', // Translation key for the resource title
    url: 'https://glahr.org/our-work',
  },
  // Add more community resources here as needed.
];

const SettingsDrawer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="filters-content">
      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Community Resources Section */}
      <Card title={t('communityResources')} style={{ marginTop: 24 }}>
        <List
          itemLayout="horizontal"
          dataSource={communityResources}
          renderItem={(item) => (
            <List.Item>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {t(item.key)}
              </a>
            </List.Item>
          )}
        />
      </Card>

      {/* Disclaimer */}
      <div className="disclaimer" style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        {t('disclaimer')}
      </div>
    </div>
  );
};

export default SettingsDrawer;
