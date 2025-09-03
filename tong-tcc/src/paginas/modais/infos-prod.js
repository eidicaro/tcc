import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import '../../styles/infosProd.css';
import { useCarrinho } from '../hooks/useCarrinho';

const InfosProd = ({ produto, adicionais, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState([]);
  const { adicionarProduto } = useCarrinho();

  const toggleAdicional = (adicional) => {
    const existe = adicionaisSelecionados.find(a => a.id_adicional === adicional.id_adicional);
    if (existe) {
      setAdicionaisSelecionados(adicionaisSelecionados.filter(a => a.id_adicional !== adicional.id_adicional));
    } else {
      setAdicionaisSelecionados([...adicionaisSelecionados, adicional]);
    }
  };

  const handleAdicionarCarrinho = async () => {
    // soma os preços dos adicionais (mesmo se vierem como string)
    const precoAdicionais = adicionaisSelecionados.reduce((total, adicional) => {
      const precoNum = parseFloat(adicional.preco) || 0; // força número
      return total + precoNum;
    }, 0);
  
    // calcula o preço final do produto já com adicionais
    const precoFinal = parseFloat(produto.preco) + precoAdicionais;
  
    const produtoComUID = {
      ...produto,
      preco: precoFinal, // já vem com adicionais incluídos
      adicionais: adicionaisSelecionados,
      quantidade: 1,
      uid: produto.uid || `${produto.id_produto}-${Date.now()}`,
    };
  
    console.log("Produto montado no InfosProd:", produtoComUID);
  
    try {
      const resultado = await adicionarProduto(produtoComUID);
      console.log("Produto enviado:", resultado);
    } catch (erro) {
      console.error("Erro ao enviar produto:", erro);
    }
  
    onClose();
  };
  
  
  

  useEffect(() => {
    setIsOpen(true);
    return () => {
      if (isClosing) setIsOpen(false);
    };
  }, [isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : isClosing ? 'closed' : 'default'}`}>
      <div className={`modal-produto ${isOpen ? 'open' : isClosing ? 'closed' : 'default'}`}>
        <button className="fechar" onClick={handleClose}>×</button>
        <div className="modal-header">
          <img src={`http://127.0.0.1:8000/storage/${produto.imagem}`} alt={produto.nome} />
          <button className="btn-avancar" onClick={handleAdicionarCarrinho}>Avançar</button>
        </div>
        <div className="modal-body">
          <h2 className="produto-nome">{produto.nome}</h2>
          <p className="produto-preco">R$ {Number(produto.preco).toFixed(2)}</p>
          <p className="produto-desc">{produto.descricao}</p>

          <div className="adicionais-lista">
            {Array.isArray(adicionais) && adicionais.length > 0 ? (
              adicionais.map((adicional) => (
                <div className="adicional-item" key={adicional.id_adicional}>
                  <img src={`http://127.0.0.1:8000/storage/${adicional.imagem}`} alt={adicional.nome} />
                  <span>{adicional.nome}</span>
                  <div className="butão">
                    <span>R$ {Number(adicional.preco).toFixed(2)}</span>  
                    <button className="btn-mais" onClick={() => toggleAdicional(adicional)}>
                      <FaPlus size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="sem-adicionais">Nenhum adicional disponível.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfosProd;
