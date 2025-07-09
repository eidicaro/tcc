// src/components/modais/ModalProduto.js
import React from 'react';
import '../../style.css';

const InfosProd = ({ produto, adicionais, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-produto">
        <button className="fechar" onClick={onClose}>×</button>

        <div className="modal-header">
          <img src={`http://localhost:8000/storage/${produto.imagem}`} alt={produto.nome} />
        </div>

        <div className="modal-body">
          <h2 className="produto-nome">{produto.nome}</h2>
          <p className="produto-preco">R$ {produto.preco}</p>
          <p className="produto-desc">{produto.descricao}</p>

          <div className="adicionais-lista">
            {adicionais.map(adicional => (
              <div className="adicional-item" key={adicional.id_adicional}>
                <span>{adicional.nome}</span>
                <span>R$ {adicional.preco}</span>
                <button className="btn-mais">+</button>
              </div>
            ))}
          </div>

          <button className="btn-avancar">Avançar</button>
        </div>
      </div>
    </div>
  );
};

export default InfosProd;
