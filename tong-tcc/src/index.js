import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './style.css';
import AppRoutes from './assets/router';
import reportWebVitals from './reportWebVitals';
import { CarrinhoProvider } from './paginas/hooks/useCarrinho';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CarrinhoProvider>
      <AppRoutes />
    </CarrinhoProvider>
  </React.StrictMode>
);

reportWebVitals();
