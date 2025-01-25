// src/RootApp.tsx
import React from 'react';

import { Provider as ReduxProvider } from 'react-redux';
import ConfigProvider from 'antd/lib/config-provider';
import enGB from 'antd/lib/locale/en_GB';

import i18n from './i18n';
import { store } from './store/store';

import { useMapSetup } from './map/useMapSetup';
import { MapProvider } from './map/MapProvider';
import App from './App';

const getConfigLang = (lang: string) => enGB;

export const RootApp: React.FC = () => {
    // 1) Our custom hook that sets up the OlMap instance
    const map = useMapSetup();

    return (
        <ConfigProvider locale={getConfigLang(i18n.language)}>
            <ReduxProvider store={store}>
                {/* 2) Provide the map to our app via context */}
                <MapProvider map={map}>
                    <App />
                </MapProvider>
            </ReduxProvider>
        </ConfigProvider>
    );
};