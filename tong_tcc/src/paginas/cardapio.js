import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './modais/header.js';
import Footer from './modais/footer';
import Sidebar from './modais/sidebar.js';
import Loader from './modais/loader.js';
import axios from 'axios';
import '../style.css';
import sushiImg from '../images/sunomono.png';

const Cardapio = () => {
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cardapio')
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

      <div className="content-wrap">
          <Sidebar />

          <div className="produtos">
            {/* Produto 1 */}
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

            {/* Produto 2 */}
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

            {/* Produto 3 */}
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

    </div>
  );
};

export default Cardapio;
