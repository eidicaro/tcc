import { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import '../../styles/infosProd.css';
import { useCarrinho } from '../hooks/useCarrinho';

const InfosProd = ({ produto, adicionais, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const { adicionarProduto } = useCarrinho();

  const toggleAdicional = (adicional) => {
    const existe = adicionaisSelecionados.find(a => a.id_adicional === adicional.id_adicional);
    if (existe) {
      setAdicionaisSelecionados(adicionaisSelecionados.filter(a => a.id_adicional !== adicional.id_adicional));
    } else {
      setAdicionaisSelecionados([...adicionaisSelecionados, adicional]);
    }
  };

  const handleAdd = (adicional) => {
    setQuantidades((prev) => ({
      ...prev,
      [adicional.id_adicional]: (prev[adicional.id_adicional] || 0) + 1,
    }));
    toggleAdicional(adicional);
  };

  const handleRemove = (adicional) => {
    setQuantidades((prev) => {
      const novaQtd = (prev[adicional.id_adicional] || 0) - 1;
      if (novaQtd <= 0) {
        const { [adicional.id_adicional]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [adicional.id_adicional]: novaQtd };
    });

    // Remove o adicional se chegar a 0
    setAdicionaisSelecionados((prev) =>
      prev.filter((a) => a.id_adicional !== adicional.id_adicional)
    );
  };

  const handleAdicionarCarrinho = async () => {
    const precoAdicionais = adicionaisSelecionados.reduce((total, adicional) => {
      const precoNum = parseFloat(adicional.preco) || 0;
      return total + precoNum;
    }, 0);

    const precoFinal = parseFloat(produto.preco) + precoAdicionais;

    const produtoComUID = {
      ...produto,
      preco: precoFinal,
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
          <h3 className="produto-nome">{produto.nome}</h3>
          <p className="produto-preco">R$ {Number(produto.preco).toFixed(2)}</p>
          <p className="produto-desc">{produto.descricao}</p>

          <div className="adicionais-lista">
            {Array.isArray(adicionais) && adicionais.length > 0 ? (
              adicionais.map((adicional) => (
                <div className="adicional-item" key={adicional.id_adicional}>
                  <img
                    src={`http://127.0.0.1:8000/storage/${adicional.imagem}`}
                    alt={adicional.nome}
                  />
                  <span className="adicional-nome">{adicional.nome}</span>

                  <div className="adicional-controle">
                    <span className="adicional-preco">
                      R$ {Number(adicional.preco).toFixed(2)}
                    </span>

                    <div className="botoes">
                      {quantidades[adicional.id_adicional] > 0 && (
                        <button
                          className="btn-menos"
                          onClick={() => handleRemove(adicional)}
                        >
                          <FaMinus size={12} />
                        </button>
                      )}

                      {quantidades[adicional.id_adicional] > 0 && (
                        <span className="contador">
                          {quantidades[adicional.id_adicional]}
                        </span>
                      )}

                      <button
                        className="btn-mais"
                        onClick={() => handleAdd(adicional)}
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>
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
