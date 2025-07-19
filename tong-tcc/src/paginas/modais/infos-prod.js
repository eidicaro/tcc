// Modal das informações do produto
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import '../../style.css';

const InfosProd = ({ produto, adicionais, onClose }) => {
  // Gerencia os estados de abertura e fechamento
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Quando o modal for aberto, inicia a animação
    setIsOpen(true);

    // Se o modal for fechado, inicia a animação de fechamento
    return () => {
      if (isClosing) {
        setIsOpen(false);
      }
    };
  }, [isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 500); // Após a animação, chama o onClose
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : isClosing ? 'closed' : 'default'}`}>
      <div className={`modal-produto ${isOpen ? 'open' : isClosing ? 'closed' : 'default'}`}>
        <button className="fechar" onClick={handleClose}>×</button>

        <div className="modal-header">
          <img src={`http://localhost:8000/storage/${produto.imagem}`} alt={produto.nome} />
          <button className="btn-avancar">Avançar</button>
        </div>

        <div className="modal-body">
          <h2 className="produto-nome">{produto.nome}</h2>
          <p className="produto-preco">R$ {produto.preco}</p>
          <p className="produto-desc">{produto.descricao}</p>

          <div className="adicionais-lista">
              {adicionais.map(adicional => (
                  <div className="adicional-item" key={adicional.id_adicional}>
                    <img src={`http://localhost:8000/storage/${adicional.imagem}`} alt={adicional.nome} />
                    <span>{adicional.nome}</span>
                    <div className="butão">
                      <span>R$ {adicional.preco}</span>  
                      <button className="btn-mais"><FaPlus size={14} /></button>
                    </div>
                  </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfosProd;
