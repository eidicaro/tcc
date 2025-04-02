import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Loader from './loader.js';

// Páginas exemplo
const Home = () => {
  return <div>Home</div>;
};

const Cardapio = () => {
  return <div>Cardápio</div>;
};

const Appload = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const handleNavigation = (path) => {
    setLoading(true); 
    setTimeout(() => {
      navigate(path); 
      setLoading(false); 
    }, 3000); 
  };

  return (
    <div>
      <Loader loading={loading} /> {/* Passa o estado de loading para o Loader */}
      <nav>
        <button onClick={() => handleNavigation('/')}>Home</button>
        <button onClick={() => handleNavigation('/about')}>Cardápio</button>
      </nav>

      {/* Define as rotas do React Router */}
      <Routes>
        <Route path="../App.js" element={<Home />} />
        <Route path="./cardapio.js" element={<Cardapio />} />
      </Routes>
    </div>
  );
};

export default Appload;
