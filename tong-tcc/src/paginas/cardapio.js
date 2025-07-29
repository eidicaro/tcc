import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './modais/header.js';
import Sidebar from './modais/sidebar.js';
import Loader from './modais/loader.js';
import axios from 'axios';
import '../style.css';
import '../md.css';
import InfosProd from './modais/infos-prod.js'; 

function Cardapio() {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [adicionais, setAdicionais] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const abrirModalProduto = async (produto) => {
    setProdutoSelecionado(produto);
    try {
      const res = await axios.get(`http://localhost:8000/api/produtos/${produto.id_produto}/adicionais`);
      setAdicionais(res.data);
      setMostrarModal(true);

    } catch (err) {
      console.error("Erro ao carregar adicionais:", err);
      setAdicionais([]);
    }
  };
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

    // conexão com axios aqui
  useEffect(() => {
    axios.get('http://localhost:8000/api/produtos')
      .then(res => {
        setProdutos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro:", err);
        setLoading(false);
      });
  }, []);

  // chama a categoria
    useEffect(() => {
      axios.get('http://localhost:8000/api/categoria')
        .then(res => setCategorias(res.data))
        .catch(err => console.error("Erro ao carregar categorias:", err));
    }, []);



  return loading ? (
    // inicia com o carregamento do loader
    <Loader loading={true} />
  ) : (
    // conteudo
    <div className="page-container">
      <Header />

      {/* conteudo em si fora do header */}
      <div className="content-wrap" style={{marginBottom: '20%'}}>
          <Sidebar />

      <div className="produtos">
        {categorias.map((categoria) => (
          <section key={categoria.id_categoria} id={categoria.nome.toLowerCase().replace(/\s/g, "-")}>
            <h2 style={{ color: '#000', margin: '30px 0 10px' }}>{categoria.nome}</h2>

            {produtos
              .filter(p => p.id_categoria === categoria.id_categoria)
              .map((p) => (
                <div className='prod' key={p.id_produto}>
                  <img
                    src={`http://localhost:8000/storage/${p.imagem}`}
                    alt={p.nome}
                    style={{ width: '200px', borderRadius: '10px' }}
                  />
                  <article>
                    <h1>{p.nome}</h1>
                    <p className='descricao'>{p.descricao}</p>
                    <section>
                      <p>{p.preco}</p>
                      <button className="botao" onClick={() => abrirModalProduto(p)}>Saiba Mais</button>
                    </section>
                  </article>
                </div>
              ))}
          </section>
        ))}
      </div>

      </div>

      {/* ✅ Modal de produto (aparece sobre a tela toda) */}
      {mostrarModal && produtoSelecionado && (
      <InfosProd
        produto={produtoSelecionado}
        adicionais={adicionais}
        onClose={() => setMostrarModal(false)}
      />
    )}


    </div>
  );
};

export default Cardapio;
