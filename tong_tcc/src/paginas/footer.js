import React from 'react';
import tong from './../images/tong-2.svg';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'; // <-- importação dos ícones
import '../style.css';

const Footer = () => {
  return (
    <footer className="footer-container">
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
              <li><a href="/">VIII</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-section text-center">
          <img src={tong} alt="Tong Sushi Logo" width="250" />

          {/* Ícones sociais */}
          <div className="footer-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram size={24} color="#fff" style={{ marginRight: '20px' }} /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF size={24} color="#fff"  style={{ marginRight: '20px' }} /> </a>
            <a href="https://wa.me/SEUNUMERO" target="_blank" rel="noopener noreferrer"><FaWhatsapp size={24} color="#fff" style={{ marginRight: '20px' }} /></a>
          </div>
        </div>
      </div>

      <div className="footer text-center">
        <h4>Todos direitos reservados ©TongSushi</h4>
      </div>
    </footer>
  );
};

export default Footer;
