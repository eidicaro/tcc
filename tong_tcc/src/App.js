import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './paginas/header.js'; // ajuste o caminho conforme a estrutura do seu projeto
import Footer from './paginas/footer.js';
import Carrossel from './paginas/carrossel.js';
import Btt from './paginas/btt-cardapio.js';

const App = () => {
  return (
      <html className='html col-12'  lang="pt-br">
        
      <div >
            <Header/>
            <main className="container mt-5 ">
              <h1>Seja Bem-Vindo!</h1>
              <p>Somos a Tong Sushi,  uma casa de culinária japonesa localizada em Iperó-SP,  agora com uma cara nova e um novo sistema de delivery para sua melhor experiência.</p>
            </main>  
            < Carrossel/>  

            {/* Horário de Atendimento */}
            <div className='horario'>
            <h1>Horário de Atendimento</h1>
            
              <p>Segunda-Quinta: 18:30-22:00</p>
              <p>Sexta-sabado: 18:30-22:30</p>
            </div>
            <Btt/>
            
            <Footer/>
      </div>
      </html>
  );
};

export default App;
