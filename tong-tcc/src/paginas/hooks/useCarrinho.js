// useCarrinho.js
import { useState, useEffect } from "react";

export function useCarrinho() {
  const [carrinho, setCarrinho] = useState([]);

  // Carregar carrinho do localStorage quando a página abrir
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho");
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  // Adicionar produto (com adicionais)
  const adicionarProduto = (produto) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, produto]);
  };

  // Remover produto pelo índice (exemplo: item duplicado continua separado)
  const removerProduto = (index) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.filter((_, i) => i !== index)
    );
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem("carrinho");
  };

  return {
    carrinho,
    adicionarProduto,
    removerProduto,
    limparCarrinho,
  };
}
