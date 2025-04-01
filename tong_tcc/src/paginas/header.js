// Header.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css'
import Carrinho from './carrinho';
import tong from './../images/tong-2.svg';


const Header = () => {
  return (
    <div className='navbar'>
    <nav className="navbar navbar-expand-lg navbar-dark col-12">
    
      <div className="container">
        <img src={tong} alt="Logo Tong Sushi" width="90" className="logo" />
        <a className="navbar-titulo">TONG SUSHI</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href='./cardapio'>Cardápio</a>
            </li>
            <li className="nav-item">
                <Carrinho/>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </div>
    
  );
};

export default Header;