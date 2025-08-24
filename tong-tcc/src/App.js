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
import  { useCarrinho }  from './paginas/hooks/useCarrinho';

const App = () => {
  const [loading, setLoading] = useState(true);

  // ✅ Hook do carrinho (centralizado)
  const { carrinho, adicionarProduto, limparCarrinho } = useCarrinho();

  // Estado dos produtos
  const [produtos, setProdutos] = useState([]);
  
  // Buscar produtos na API
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/produtos');
        setProdutos(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setLoading(false);
      }
    };
    carregarProdutos();
  }, []);
  

  // Finalizar pedido
  const finalizarPedido = async (idCliente) => {
    try {
      const res = await axios.post('http://localhost:8000/api/carrinho/finalizar', {
        id_cliente: idCliente,
        itens: carrinho
      });
      console.log('Pedido finalizado:', res.data);
      limparCarrinho();
      alert('Pedido enviado com sucesso!');
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      alert('Erro ao enviar pedido.');
    }
  };

  // 🔍 Teste para verificar se o carrinho foi criado
  useEffect(() => {
    console.log("Carrinho atual:", carrinho);
  }, [carrinho]);

  if (loading) return <Loader loading={true} />;
    
  return (
    <div>
      <Header carrinho={carrinho} finalizarPedido={finalizarPedido} />

      <main className="container mt-5">
        <h1>Seja Bem-Vindo!</h1>
        <p>
          Somos a Tong Sushi, uma casa de culinária japonesa localizada em Iperó-SP,
          agora com uma cara nova e um novo sistema de delivery para sua melhor experiência.
        </p>
      </main>

      {/* Carrossel recebe produtos e a função de adicionar */}
      <Carrossel produtos={produtos} adicionarProduto={adicionarProduto} />

      <h1 className='horario-h1'>Horário de Atendimento</h1>
      <div className='sla'>
        <div className='horario'>
          <p className='pa'>Segunda-Quinta: 18:30-22:00</p>
          <p className='pa'>Sexta-Sábado: 18:30-22:30</p>
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
          allowFullScreen="" loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </div>

      <Footer />
    </div>
  );
};

export default App;
