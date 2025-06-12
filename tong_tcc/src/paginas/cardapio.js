import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './modais/header.js';
import Footer from './modais/footer';
import Sidebar from './modais/sidebar.js';
import Loader from './modais/loader.js';
import axios from 'axios';

const Cardapio = () => {
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    // Requisição à API Laravel
    axios.get('http://localhost:8000/api/cardapio') // ajuste se sua rota for diferente
      .then(response => {
        setProdutos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar cardápio:', error);
        setLoading(false);
      });
  }, []);

return loading ? (
  <Loader loading={true} />
) : (
  <div className="page-container">
    <Header />

    <div className="main-content">
      <Sidebar />
      <div className="produtos">
        {/* Aqui vai seu conteúdo de produtos */}
      </div>
    </div>

    <Footer />

  </div>
);


};

export default Cardapio;
