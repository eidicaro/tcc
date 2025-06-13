import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './modais/header.js';
import Footer from './modais/footer';
import Sidebar from './modais/sidebar.js';
import Loader from './modais/loader.js';
import axios from 'axios';
import sushiImg from '../images/sunomono.png';


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
  
        <div className='prod'>
        <img src={sushiImg} alt="Sushi" style={{ width: '200px' }} />
          <article>
            <h1>Sunomono</h1>
            <p>Salada agridoce de pepino com gergelim.</p>
            <section>
              <p>R$ 18,00</p>
              <button className="botao">Saiba Mais</button>
            </section>
          </article>

        </div>
      </div>

    </div>

    <Footer />

  </div>
);


};

export default Cardapio;
