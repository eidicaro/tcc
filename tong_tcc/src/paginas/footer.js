import React from 'react';
import tong from './../images/tong-2.svg';
import '../style.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top text-center">
      </div>

      <div className="container footer-content">
        <div className="footer-section">
          <h4>Páginas :</h4>
          <ul className="list-unstyled">
            <li><a href="/">Home</a></li>
            <li><a href="/carrinho">Carrinho</a></li>
            <li><a href="/cardapio">Cardápio</a></li>
          </ul>
          
          <div className='footer-grupo'>
          <h5>Desenvolvido por:</h5>
          <ul className="list-unstyled">
            <li><a href="/">Nome do grupo</a></li>
          </ul>
          </div>
        </div>

       

        <div className="footer-section text-center">
          <img src={tong} alt="Tong Sushi Logo" width="250" />
          <div className="footer-social mt-2"></div>
        </div>
      </div>
{/* 
      <div className='footer-icons mt-2'>
      <a href="#"><img src={face} width="10"></a>
      <a href="#"><img src={insta} width="10"></a>
      <a href="#"><img src={whats} width="10"></a>
      </div> */}

      <div className="footer text-center">
      <h3>Todos direitos reservados ©TongSushi</h3>
      </div>
    </footer>
  );
};

export default Footer;
