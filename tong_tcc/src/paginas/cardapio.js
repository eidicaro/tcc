import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../paginas/header';
import Footer from '../paginas/footer';
import Sidebar from './sidebar';
import Loader from './loader.js';
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
    <div>
      <Header />
      <Sidebar />
      <div className='produtos'>
       
      </div>
      <Footer />
    </div>
  );
};

export default Cardapio;
