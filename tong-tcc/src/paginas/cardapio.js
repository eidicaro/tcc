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
  const [adicionais, setAdicionais] = useState([]); // todos adicionais
  const [adicionaisProduto, setAdicionaisProduto] = useState([]); // adicionais filtrados
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  //🔹 Abre modal e filtra adicionais pelo produto
  const abrirModalProduto = (produto) => {
    setProdutoSelecionado(produto);

    // Filtra os adicionais que pertencem a este produto
    const adicionaisFiltrados = adicionais.filter(adc => adc.id_produto === produto.id_produto);
    setAdicionaisProduto(adicionaisFiltrados);

    setMostrarModal(true);
  };

  //  Inicializa sessão do cliente e carrega adicionais gerais
  useEffect(() => {
    async function inicializarSessao() {
      try {
        //  Criar carrinho vazio (se não existir)
        if (!localStorage.getItem("id_carrinho")) {
          const resCarrinho = await axios.post("http://localhost:8000/api/carrinho/criar");
          localStorage.setItem("id_carrinho", resCarrinho.data.id_carrinho);
          console.log("Carrinho criado:", resCarrinho.data.id_carrinho);
        } else {
          console.log("Carrinho já existente:", localStorage.getItem("id_carrinho"));
        }

        //  Carregar todos os adicionais de todos os produtos
        const resAdicionais = await axios.get("http://localhost:8000/api/adicionais");
        setAdicionais(resAdicionais.data);
        console.log("Adicionais carregados:", resAdicionais.data);

      } catch (error) {
        console.error("Erro ao inicializar sessão:", error);
      }
    }

    inicializarSessao();
  }, []);

  //  Carregar produtos
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

  //  Carregar categorias
  useEffect(() => {
    axios.get('http://localhost:8000/api/categoria')
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Erro ao carregar categorias:", err));
  }, []);

  return loading ? (
    <Loader loading={true} />
  ) : (
    <div className="page-container">
      <Header />

      <div className="content-wrap" style={{ marginBottom: '20%' }}>
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

      {/* Modal de produto */}
      {mostrarModal && produtoSelecionado && (
        <InfosProd
          produto={produtoSelecionado}
          adicionais={adicionaisProduto} // apenas os adicionais filtrados
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default Cardapio;
