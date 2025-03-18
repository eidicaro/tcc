import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './paginas/header.js'; // ajuste o caminho conforme a estrutura do seu projeto
import Footer from './paginas/footer.js';
import Carrossel from './paginas/carrossel.js';

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
            <Footer/>
      </div>
      </html>
  );
};

export default App;
