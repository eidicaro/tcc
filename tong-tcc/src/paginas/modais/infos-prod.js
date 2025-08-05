// Modal das informações do produto
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import '../../style.css';
import axios from 'axios';


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

  // Colocar produto com adicional no carrinho

  const handleAdicionarAdicional = async (idAdicional) => {
    try {
      const idCarrinho = localStorage.getItem('id_carrinho'); // ajuste se vier por prop
      const idProduto = produto.id_produto;
  
      if (!idCarrinho) {
        alert("Carrinho não encontrado.");
        return;
      }
  
      const response = await axios.post('http://127.0.0.1:8000/api/carrinho/adicional', {
        id_carrinho: parseInt(idCarrinho),
        id_produto: idProduto,
        id_adicional: idAdicional,
        quantidade: 1
      });
  
      console.log('Adicional adicionado:', response.data);
      alert("Adicional adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar adicional:", error);
      alert("Erro ao adicionar adicional.");
    }
  };
  

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 500); // Após a animação, chama o onClose
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : isClosing ? 'closed' : 'default'}`}>
      <div className={`modal-produto ${isOpen ? 'open' : isClosing ? 'closed' : 'default'}`}>
        <button className="fechar" onClick={handleClose}>×</button>

        <div className="modal-header">
          <img src={`http://127.0.0.1:8000/storage/${produto.imagem}`} alt={produto.nome} />
          <button className="btn-avancar">Avançar</button>
        </div>

        <div className="modal-body">
          <h2 className="produto-nome">{produto.nome}</h2>
          <p className="produto-preco">R$ {produto.preco}</p>
          <p className="produto-desc">{produto.descricao}</p>

          <div className="adicionais-lista">
              {adicionais.map(adicional => (
                  <div className="adicional-item" key={adicional.id_adicional}>
                    <img src={`http://127.0.0.1:8000/storage/${adicional.imagem}`} alt={adicional.nome} />
                    <span>{adicional.nome}</span>
                    <div className="butão">
                      <span>R$ {adicional.preco}</span>  

                      <button
                        className="btn-mais"
                        onClick={() => handleAdicionarAdicional(adicional.id_adicional)}
                      >
                        <FaPlus size={14} />
                      </button>

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
