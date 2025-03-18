// Footer.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import tong from './../images/tong-2.svg';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-4 pb-3 mt-5">
      <div className="container">
        <div className="row text-center text-lg-start align-items-start">
          {/* Título central */}
          <div className="col-12 mb-4">
            <h5 className="fw-bold text-center">Todos direitos reservados ©TongSushi</h5>
          </div>

          {/* Coluna de Páginas */}
          <div className="col-lg-4 mb-4">
            <h6 className="fw-bold">Páginas :</h6>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-white text-decoration-none">Home</a></li>
              <li><a href="#carrinho" className="text-white text-decoration-none">Carrinho</a></li>
              <li><a href="#cardapio" className="text-white text-decoration-none">Cardápio</a></li>
            </ul>
          </div>

          {/* Coluna Desenvolvido por */}
          <div className="col-lg-4 mb-4">
            <h6 className="fw-bold">Desenvolvido por:</h6>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
              <div className="me-4">Ícaro Redni</div>
              <div className="me-4">Isack Martins</div>
              <div className="me-4">Isabelly Andrade</div>
              <div className="me-4">Victor Mizutani</div>
            </div>
          </div>

          {/* Logo e ícones sociais */}
          <div className="col-lg-4 mb-4 text-center">
            <img src={tong} alt="Logo Tong Sushi" width="250" className="mb-3" />
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="text-white fs-4"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white fs-4"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white fs-4"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="text-center pt-3 border-top mt-3">
          <p className="mb-0">Av. Paulo Antunes Moreira, 601 - Centro, Iperó – SP, 18560-000</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;