import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style.css';
import '../../md.css';
import Carrinho from './carrinho';
import { Modal } from './modal_carrinho';
import tong from './../../images/tong-2.svg';
import ConteudoCarrinho from './conteudoCarrinho'; // novo import


const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className='navbar'>
      <nav className="navbar navbar-expand-lg navbar-dark col-12">
        <div className="container">
          <img src={tong} alt="Logo Tong Sushi" width="90" className="logo" />
          <span className="navbar-titulo">TONG SUSHI</span>
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
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cardapio">Cardápio</Link>
              </li>
              <li className="nav-item">
                <button onClick={toggleModal} className="btn btn-link p-0">
                  <Carrinho />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    {/* Conteudo do modal do Carrinho */}
        {isModalOpen && (
            <Modal
              title="Seu Carrinho"
              subtitle="Veja as suas gostosuras"
              isOpen={isModalOpen}
              toggleModal={toggleModal}
              modalContent={<ConteudoCarrinho />} // aqui usa o conteúdo real
            />
        )}
    </div>
  );
};

export default Header;
