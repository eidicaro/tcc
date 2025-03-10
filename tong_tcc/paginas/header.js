// Header.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';



const Header = () => {
  return (
    <div className='navbar'>
    <nav className="navbar navbar-expand-lg navbar-dark col-12">
      <div className="container">
        <a className="navbar-brand" href="#">Meu Site</a>
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
              <a className="nav-link" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">Sobre</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#services">Serviços</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contato</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#profile">
                <img 
                  src="/avatar.png" 
                  alt="Avatar" 
                  width="30" 
                  height="30" 
                  className="rounded-circle"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </div>
    
  );
};

export default Header;
