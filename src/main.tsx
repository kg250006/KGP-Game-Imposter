import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { initDevHelpers } from './features/premium/utils/devHelpers';
import { initQuickModeToggle } from './features/featureFlags/utils/quickModeToggle';

// Initialize development helpers (only active in dev mode)
initDevHelpers();

// Initialize quick mode toggle (works in ALL modes)
initQuickModeToggle();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
