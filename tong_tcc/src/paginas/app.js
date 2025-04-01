import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Loader from './loader.js'; // Importando o componente de loader

// Páginas exemplo
const HomePage = () => {
  return <div>Home Page</div>;
};

const AboutPage = () => {
  return <div>About Page</div>;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Usando o hook de navegação do React Router

  // Função para iniciar o carregamento antes de navegar
  const handleNavigation = (path) => {
    setLoading(true); // Começa o carregamento
    setTimeout(() => {
      navigate(path); // Navega para a página desejada
      setLoading(false); // Para o carregamento depois de 3 segundos
    }, 3000); // Simula o tempo de carregamento (ajuste conforme necessário)
  };

  return (
    <div>
      <Loader loading={loading} /> {/* Passa o estado de loading para o Loader */}
      <nav>
        <button onClick={() => handleNavigation('/')}>Home</button>
        <button onClick={() => handleNavigation('/about')}>About</button>
      </nav>

      {/* Define as rotas do React Router */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
};

export default App;
