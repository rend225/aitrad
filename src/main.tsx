import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { TranslationProvider } from './contexts/TranslationContext';
import App from './App.tsx';
import './index.css';
import './i18n';

// Import and initialize daily reset scheduler
import { initializeDailyResetScheduler } from './services/dailyReset';

// Initialize the daily reset scheduler when the app starts
initializeDailyResetScheduler();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TranslationProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </TranslationProvider>
  </StrictMode>
);