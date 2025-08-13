import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import Header from './paginas/modais/header.js';
import Footer from './paginas/modais/footer.js';
import Carrossel from './paginas/modais/carrossel.js';
import Btt from './paginas/modais/btt-cardapio.js';
import poke from './images/poke.png';
import Loader from './paginas/modais/loader.js';
import { useState, useEffect } from 'react';
import axios from 'axios';


const App = () => {
  
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
          alert("Carrinho criado:", resCarrinho.data.id_carrinho);
        } else {
          alert("Carrinho já existente:", localStorage.getItem("id_carrinho"));
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
    
  

  return loading ? <Loader loading={true} /> : 
  <div>
       <Header />
      <main className="container mt-5">
        <h1>Seja Bem-Vindo!</h1>
        <p>Somos a Tong Sushi, uma casa de culinária japonesa localizada em Iperó-SP, agora com uma cara nova e um novo sistema de delivery para sua melhor experiência.</p>
      </main>
      <Carrossel />
      
      <h1 className='horario-h1'>Horário de Atendimento</h1>
      <div className='sla'>
          <div className='horario'>
              <p className='pa'>Segunda-Quinta: 18:30-22:00</p>
              <p className='pa'>Sexta-sabado: 18:30-22:30</p>
              <Btt />
          </div>
          <img src={poke} alt="salmao" className='poke' />
      </div>

      <div className='mapa'>

          <div className='local'>
            <h1>Nossa localização</h1>
            <p>Rua Orlando Sartorelli 45, Centro</p>
            <p>Iperó/SP</p>
          </div>
  
          <iframe 
            id="localization" 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4356.226877656857!2d-47.6898667!3d-23.3514105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8396108f88ca8cb3%3A0x87a04fcb137e595!2sTong%20Sushi%20Iper%C3%B3!5e0!3m2!1spt-BR!2sbr!4v1709918912454!5m2!1spt-BR!2sbr" 
            width="30%" height="272px" 
            allowfullscreen="" loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>

      </div>

      <Footer />
     
  </div>;


};

export default App;
