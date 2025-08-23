import { useState, useEffect } from "react";
import axios from "axios";

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
  const adicionarProduto = async (produto) => {
    // Gera UID único caso não exista
    const produtoComUID = {
      ...produto,
      uid: produto.uid || Date.now()
    };

    // Atualiza estado local
    setCarrinho((prev) => [...prev, produtoComUID]);

    // Envia para o back-end
    try {
      await axios.post("http://127.0.0.1:8000/api/carrinho/adicionar", {
        produto: produtoComUID
      });
      console.log("Produto enviado ao back-end:", produto.nome);
    } catch (err) {
      console.error("Erro ao enviar produto para o back-end:", err);
    }
  };

  // Remover produto pelo UID
  const removerProduto = (uid) => {
    const novoCarrinho = carrinho.filter((p) => p.uid !== uid);
    setCarrinho(novoCarrinho);

    // Atualiza back-end também
    axios
      .delete(`http://127.0.0.1:8000/api/carrinho/remover/${uid}`)
      .catch((err) => console.error("Erro ao remover produto do back-end:", err));
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem("carrinho");
    axios
      .post("http://127.0.0.1:8000/api/carrinho/limpar")
      .catch((err) => console.error("Erro ao limpar carrinho no back-end:", err));
  };

  return {
    carrinho,
    adicionarProduto,
    removerProduto,
    limparCarrinho,
  };
}
