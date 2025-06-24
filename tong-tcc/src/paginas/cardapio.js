import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './modais/header.js';
import Sidebar from './modais/sidebar.js';
import Loader from './modais/loader.js';
import axios from 'axios';
import '../style.css';
import sushiImg from '../images/sunomono.png';

function Cardapio() {
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);

useEffect(() => {
  axios.get('http://localhost:8000/api/produtos')
    .then(res => {
      setProdutos(res.data);
      setLoading(false); // ✅ Agora só desativa o loading depois que os dados chegarem
    })
    .catch(err => {
      console.error("Erro:", err);
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
            {/* <div className='prod'>
              <img src={sushiImg} alt="Sushi" style={{ width: '200px' }} />
              <ul>
                  {produtos.map(p => (
                  <li key={p.id_produto}>{p.nome} {p.descricao} ({p.preco})</li>
                ))}
              </ul>
            </div> */}

            {/* Produto 2 */}
            {produtos.map(p =>(
            <div className='prod'>
              <img src={sushiImg} alt="Sushi" style={{ width: '200px' }} />
              
                <article>
                <h1>{p.nome}</h1>
                <p>{p.descricao}</p>
                <section>
                  <p>{p.preco}</p>
                  <button className="botao">Saiba Mais</button>
                </section>
              </article>

              
            </div>
            ))}        
          </div>

      </div>

    </div>
  );
};

export default Cardapio;
