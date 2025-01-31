// src/index.ts

import React, { } from 'react';
import ConfigProvider from 'antd/lib/config-provider';
import enUS from 'antd/lib/locale/en_US';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import Logger from '@terrestris/base-util/dist/Logger';
import App from './App';
import i18n from './i18n';
import { store } from './store/store';
import './index.less';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AppDataProvider } from './providers/AppDataContextProvider';

const AppLoader = () => {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <ConfigProvider locale={enUS}>
          <ReduxProvider store={store}>
            <Helmet>
              <html lang={i18n.language} />
              <title>Avoid This Zone - ICE Activity Tracker for Georgia</title>
              <meta name="description" content="Stay informed with 'Avoid This Zone,' an interactive map tracking ICE activity and providing safety alerts across Georgia. Protect your community today." />
              <meta name="keywords" content="Georgia ICE tracker, ICE activity map, avoid ICE zones, community safety, Georgia heatmap, local immigration alerts, interactive map, OpenLayers, React" />
              <meta name="author" content="Andres Castro" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta property="og:title" content="Avoid This Zone - ICE Activity Tracker for Georgia" />
              <meta property="og:description" content="Explore ICE activity and safety zones on an interactive map tailored for Georgia residents. Stay safe and protect your community." />
              <meta property="og:image" content="path/to/your/optimized-image.png" />
              <meta property="og:image:alt" content="Screenshot of the Avoid This Zone map highlighting ICE activity areas in Georgia." />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://avoidthis.zone" />
              <link rel="canonical" href="https://avoidthis.zone" />
            </Helmet>
            <App />
          </ReduxProvider>
        </ConfigProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
};

// ----------------------------------
// 2) The main render function
// ----------------------------------
function renderApp() {
  const container = document.getElementById('app');
  if (!container) {
    Logger.error('Could not find container element with ID "app"');
    return;
  }

  const root = createRoot(container);
  root.render(<AppLoader />);
}

renderApp();