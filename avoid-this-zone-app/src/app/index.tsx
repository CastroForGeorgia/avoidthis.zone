// src/app/index.tsx

/**
 * Root entry for Avoid‑This‑Zone – Tailwind + React + Redux + i18n
 * Stripped of Ant Design, FontAwesome and legacy loaders.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';            // Adjust path if you relocate App.tsx
import '../styles/global.css';      // Tailwind layers
import '../i18n';            // i18next initialisation
import { AppDataProvider } from './providers/AppDataContextProvider';
import './index.less';

const container = document.getElementById('root') as HTMLElement;

if (!container) {
  throw new Error('Root container #root not found – check public/index.html');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <AppDataProvider>
      <App />
    </AppDataProvider>
  </React.StrictMode>
);