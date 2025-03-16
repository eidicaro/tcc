import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './paginas/header.js'; // ajuste o caminho conforme a estrutura do seu projeto
import Footer from './paginas/footer.js';

const App = () => {
  return (
      <html className='html col-12'  lang="pt-br">
        
      <div >
            <Header />
            <main className="container mt-5 ">
              <h1>Bem-vindo ao Restaurante!</h1>
              <p>Delicie-se com os melhores pratos.</p>
            </main>
            <Footer/>
      </div>
      </html>
  );
};

export default App;
