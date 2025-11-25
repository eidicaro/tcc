import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import '../../styles/carrinho.css';
import { useCarrinho } from '../hooks/useCarrinho';
import PaymentPage from './pagamento';

// ================== COMPONENTE ITEM CARRINHO ==================
const ItemCarrinho = ({ item, incrementar, decrementar, remover }) => {
  const adicionais = item.adicionais || [];
  const quantidadeProduto = Number(item.quantidade || 1);
  const precoBase = Number(item.preco || 0);

  // Soma dos adicionais POR UNIDADE do produto
  const adicionaisPorUnidade = adicionais.reduce((acc, ad) => {
    const precoAd = Number(ad.preco || 0);
    const qtdAd = Number(ad.quantidade || 1); 
    return acc + precoAd * qtdAd;
  }, 0);

  // subtotal do item = (preço base + soma adicionais por unidade) * quantidade de produto
  const subtotalItem = (precoBase + adicionaisPorUnidade) * quantidadeProduto;

  return (
    <div className="item-carrinho">
      <div className="item-carrinho-info">
        <strong>{item.nome}</strong>

        {/* mostra adicionais (quantidade por unidade e preço por unidade) */}
        {adicionais.length > 0 && (
          <ul className="lista-adicionais">
            {adicionais.map((ad, index) => {
              const precoAd = Number(ad.preco || 0);
              const qtdAd = Number(ad.quantidade || 1);
              return (
                <li key={index}>
                  {qtdAd}x {ad.nome} — R$ {(precoAd * qtdAd).toFixed(2)} por unidade
                  {quantidadeProduto > 1 && (
                    <> — total: R$ {(precoAd * qtdAd * quantidadeProduto).toFixed(2)}</>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="item-carrinho-acoes">
        <div className="icones">
          <FaTrash className="icone" onClick={() => remover(item.uid)} />
        </div>

        <div className="quantidade">
          <span className="menos" onClick={() => decrementar(item.uid)}>–</span>
          <span>{quantidadeProduto}</span>
          <span className="mais" onClick={() => incrementar(item.uid)}>+</span>
          <span className="preco">
            R$ {subtotalItem.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

// ================== COMPONENTE PRINCIPAL ==================
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

  // Total geral: soma (preco base + adicionais POR UNIDADE) * quantidade do produto
  const total = carrinho.reduce((acc, item) => {
    const precoBase = Number(item.preco || 0);
    const qtdProduto = Number(item.quantidade || 1);

    const adicionaisPorUnidade = (item.adicionais || []).reduce((s, ad) => {
      return s + (Number(ad.preco || 0) * Number(ad.quantidade || 1));
    }, 0);

    return acc + (precoBase + adicionaisPorUnidade) * qtdProduto;
  }, 0);

  return (
    <div className="conteudo-carrinho">
      <div className="itens-carrinho">
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

      {showPayment && (
        <PaymentPage
          subtotal={total}
          carrinho={carrinho}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>

    // mo trampo pa funfa
  );
};

export default ConteudoCarrinho;
