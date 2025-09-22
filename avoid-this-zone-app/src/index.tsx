// src/index.ts

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './index.less';
import '@fortawesome/fontawesome-free/css/all.min.css';

const UnderConstruction = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff'
      }}
    >
      <div>
        <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">
          <i className="fas fa-user-shield" />
        </div>
        <h1 style={{ margin: 0 }}>Avoid This Zone</h1>
        <p style={{ opacity: 0.9, marginTop: 8, fontSize: 18 }}>
          We’re rebuilding with stronger anonymity and privacy.
        </p>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Thank you for your patience. Please check back soon.
        </p>
      </div>
    </div>
  );
};

const pageTitle = 'Avoid This Zone — Under Construction';
const pageDescription = 'We’re rebuilding Avoid This Zone with stronger anonymity and privacy. Please check back soon.';

const container = document.getElementById('app');
if (!container) {
  // eslint-disable-next-line no-console
  console.error('Could not find container element with ID "app"');
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <Helmet>
          <html lang="en" />
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content="Georgia ICE tracker, privacy, safety, community, React" />
          <meta name="author" content="Andres Castro" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content="path/to/your/optimized-image.png" />
          <meta property="og:image:alt" content="Avoid This Zone under construction." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://avoidthis.zone" />
          <link rel="canonical" href="https://avoidthis.zone" />
        </Helmet>
        <UnderConstruction />
      </HelmetProvider>
    </React.StrictMode>
  );
}