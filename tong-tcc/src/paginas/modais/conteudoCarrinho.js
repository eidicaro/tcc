import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import '../../styles/carrinho.css';
import { useCarrinho } from '../hooks/useCarrinho';
import PaymentPage from './pagamento';

// ================== COMPONENTE ITEM CARRINHO ==================
const ItemCarrinho = ({ item, incrementar, decrementar, remover }) => {
  const adicionaisTexto = item.adicionais?.map(a => a.nome || a) || [];

  return (
    <div className="item-carrinho">
      <div className="item-carrinho-info">
        <strong>{item.nome}</strong>
        {adicionaisTexto.length > 0 && (
          <ul>
            {adicionaisTexto.map((ad, index) => <li key={index}>{ad}</li>)}
          </ul>
        )}
      </div>

      <div className="item-carrinho-acoes">
        <div className="icones">
          <FaTrash className="icone" onClick={() => remover(item.uid)} />
        </div>

        <div className="quantidade">
          <span className="menos" onClick={() => decrementar(item.uid)}>–</span>
          <span>{item.quantidade || 1}</span>
          <span className="mais" onClick={() => incrementar(item.uid)}>+</span>
          <span className="preco">
            R$ {(Number(item.preco) * (item.quantidade || 1)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const ConteudoCarrinho = () => {
  const { carrinho, removerProduto, atualizarQuantidade } = useCarrinho();
  const [showPayment, setShowPayment] = useState(false);

  const incrementar = (uid) => {
    const item = carrinho.find(p => p.uid === uid);
    if (item) atualizarQuantidade(uid, (item.quantidade || 1) + 1);
  };

  const decrementar = (uid) => {
    const item = carrinho.find(p => p.uid === uid);
    if (item) {
      const novaQtd = (item.quantidade || 1) - 1;
      if (novaQtd <= 0) removerProduto(uid);
      else atualizarQuantidade(uid, novaQtd);
    }
  };

  const remover = (uid) => removerProduto(uid);

  const total = carrinho.reduce(
    (acc, item) => acc + (item.preco * (item.quantidade || 1)),
    0
  );

  return (
    <div className="conteudo-carrinho">
      <div className='itens-carrinho'>
        {carrinho.length === 0 ? (
          <p>Carrinho vazio</p>
        ) : (
          carrinho.map(item => (
            <ItemCarrinho
              key={item.uid}
              item={item}
              incrementar={incrementar}
              decrementar={decrementar}
              remover={remover}
            />
          ))
        )}
      </div>

      {carrinho.length > 0 && (
        <div className="total-finalizar">
          <h3>Total: R$ {total.toFixed(2)}</h3>
          <button
            className="btn-finalizar"
            onClick={() => setShowPayment(true)}
          >
            Realizar Pagamento
          </button>
        </div>
      )}

      {/* Renderiza o modal de pagamento */}
      {showPayment && (
        <PaymentPage
          subtotal={total}
          carrinho={carrinho}   // manda pro back
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default ConteudoCarrinho;
