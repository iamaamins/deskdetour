import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource-variable/hanken-grotesk';

createRoot(document.body).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
