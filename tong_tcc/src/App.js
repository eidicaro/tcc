import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from "react-router-dom";
import Header from './paginas/header.js';
import Footer from './paginas/footer.js';
import Carrossel from './paginas/carrossel.js';
import Btt from './paginas/btt-cardapio.js';
import poke from './images/poke.png';

const App = () => {
  return (
    <Router>
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

              <Footer />
            </div>
    </Router>
  );
};

export default App;
