import React from 'react';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const FiltersDrawer: React.FC = () => {

  return (
    <div className="filters-content">
      {/* Language Switcher */}
      <LanguageSwitcher />
    </div>
  );
};

export default FiltersDrawer;
