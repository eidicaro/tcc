import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './modais/header.js';
import Sidebar from './modais/sidebar.js';
import Loader from './modais/loader.js';
import axios from 'axios';
import '../style.css';

function Cardapio() {
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [adicionais, setAdicionais] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    const abrirModalProduto = async (produto) => {
      setProdutoSelecionado(produto);
      try {
        const res = await axios.get(`http://localhost:8000/api/produtos/${produto.id_produto}/adicionais`);
        setAdicionais(res.data);
      } catch (err) {
        console.error("Erro ao carregar adicionais:", err);
        setAdicionais([]);
      }
      setMostrarModal(true);
    };

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


            {/* Produto 2 */}
            {produtos.map(p =>(
              <div className='prod' key={p.id_produto}>
                  <img
                    src={`http://localhost:8000/storage/${p.imagem}`}
                    alt={p.nome}
                    style={{ width: '200px', borderRadius: '10px' }}
                  />
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
