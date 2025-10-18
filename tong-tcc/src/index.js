import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import AppRoutes from './assets/router';
import reportWebVitals from './reportWebVitals';
import { register } from './serviceWorkerRegistration';

// Cria raiz React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);

// Ativa o PWA
register();

// Medir performance (opcional)
reportWebVitals();
