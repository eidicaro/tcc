// src/paginas/modais/ConteudoCarrinho.js
import React from 'react';
import { FaTrash, FaPen } from 'react-icons/fa';
import '../../style.css';

const ItemCarrinho = ({ nome, adicionais, preco }) => (
  <div className="item-carrinho">
    {/* Informações do item */}
    <div className="item-carrinho-info">
      <strong>{nome}</strong>
      <ul>
        {adicionais.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    {/* Ações, quantidade e preço */}
    <div className="item-carrinho-acoes">
      <div className="icones">
        <FaPen className="icone editar" title="Editar" />
        <FaTrash className="icone excluir" title="Remover" />
      </div>
      <div className="quantidade-preco">
        <div className="quantidade">
          <button className="btn-qtd">–</button>
          <span>1</span>
          <button className="btn-qtd">+</button>
        </div>
        <span className="preco">R$ {preco}</span>
      </div>
    </div>
  </div>
);

const ConteudoCarrinho = () => {
  const itens = [
    {
      nome: "CEVICHE",
      adicionais: [
        "Adicional de cheiro verde 1x",
        "Adicional de etc 1x",
        "Adicional de Trembolona 50x"
      ],
      preco: "45,90"
    },
    {
      nome: "CEVICHE",
      adicionais: [
        "Adicional de cheiro verde 1x",
        "Adicional de etc 1x",
        "Adicional de Trembolona 50x"
      ],
      preco: "45,90"
    }
  ];

  return (
    <div className="conteudo-carrinho">
      {itens.map((item, index) => (
        <ItemCarrinho
          key={index}
          nome={item.nome}
          adicionais={item.adicionais}
          preco={item.preco}
        />
      ))}
      <button className="btn-finalizar">Finalizar Pedido</button>
    </div>
  );
};

export default ConteudoCarrinho;
