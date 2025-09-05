import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './modais/header.js';
import Sidebar from './modais/sidebar.js';
import Loader from './modais/loader.js';
import axios from 'axios';
import '../styles/cardapio.css';
import '..//styles/infosProd.css'
import '../styles/mediaScreen/md_cardapio.css';
import InfosProd from './modais/infos-prod.js'; 

// todos os itens comentados provavelmente serão retirados futuramente

function Cardapio() {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  // const [adicionaisProduto, setAdicionaisProduto] = useState([]); // adicionais filtrados
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [adicionais, setAdicionais] = useState([]);
  const [adicionarProduto] = useState(false);

  const API = 'http://localhost:8000/api/carrinho';
  const [carrinho, setCarrinho] = useState([]);


  const abrirModalProduto = async (produto) => {
    setProdutoSelecionado(produto);
    setMostrarModal(true);

    // try {
    //   const res = await axios.get(`http://localhost:8000/api/produtos/${produto.id_produto}/adicionais`);
    //   console.log("Adicionais recebidos:", res.data);
    //   setAdicionaisProduto(Array.isArray(res.data) ? res.data : []); // garante array
    //   setMostrarModal(true);
    // } 
    // catch (err) {
    //   console.error("Erro ao carregar adicionais:", err);
    //   setAdicionaisProduto([]);
    // }
  };


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


  // Carregar adicionais (todos iguais para todos os produtos)
  useEffect(() => {
    axios.get('http://localhost:8000/api/adicionais')
      .then(res => setAdicionais(res.data))
      .catch(err => console.error("Erro ao carregar adicionais:", err));
  }, []);


   // busca carrinho inicial do backend
  useEffect(() => {
    const fetchCarrinho = async () => {
      try {
        // pega cookie CSRF
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
        const res = await axios.get(`${API}/listar`, { withCredentials: true });
        setCarrinho(res.data.carrinho || []);
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err);
      }
    };
    fetchCarrinho();
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
                          <div className='text-descricao'>
                            <p className='descricao'>{p.descricao}</p>

                          </div>
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
          adicionais={adicionais} // todos os adicionais disponiveis
          onClose={() => setMostrarModal(false)}
          adicionarProduto={adicionarProduto} 
        />
      )}
    </div>
  );
};

export default Cardapio;
