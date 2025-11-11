import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const API = "http://localhost:8000/api/carrinho";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const [notificacao, setNotificacao] = useState(null);
  const inicializado = useRef(false);
  const adicionandoLock = useRef(new Set());

  useEffect(() => {
    let ignore = false;
    const carregar = async () => {
      if (ignore || inicializado.current) return;
      inicializado.current = true;
      await carregarCarrinho();
    };
    carregar();
    return () => {
      ignore = true;
    };
  }, []);

  const carregarCarrinho = async () => {
    try {
      const res = await axios.get(`${API}/listar`);
      const nova = res?.data?.carrinho ?? [];
      setCarrinho(nova);
    } catch (err) {
      console.error("[CarrinhoProvider] Erro ao listar carrinho:", err);
    }
  };

  const mostrarNotificacao = (mensagem, tipo = "sucesso") => {
    setNotificacao({ mensagem, tipo });
    if (window.__timeoutNotificacao) clearTimeout(window.__timeoutNotificacao);
    window.__timeoutNotificacao = setTimeout(() => setNotificacao(null), 2400);
  };

  const adicionarProduto = async (produto) => {
    const fingerprint =
      produto?.uid ??
      `${produto?.id ?? produto?.nome}_${JSON.stringify(produto?.adicionais ?? [])}_${produto?.quantidade ?? 1}`;

    if (adicionandoLock.current.has(fingerprint)) return;

    adicionandoLock.current.add(fingerprint);
    try {
      const produtoParaEnviar = {
        ...produto,
        preco: Number(produto.preco || 0),
        quantidade: Number(produto.quantidade || 1),
        adicionais: (produto.adicionais || []).map((a) => ({
          ...a,
          preco: Number(a.preco || 0),
          quantidade: Number(a.quantidade || 1),
        })),
      };

      const res = await axios.post(`${API}/adicionar`, {
        produto: produtoParaEnviar,
      });

      const novoCarrinho = res?.data?.carrinho ?? [];
      setCarrinho(novoCarrinho);
      mostrarNotificacao("Produto adicionado ao carrinho!", "sucesso");
      return res.data;
    } catch (err) {
      mostrarNotificacao("Erro ao adicionar produto!", "erro");
      throw err;
    } finally {
      adicionandoLock.current.delete(fingerprint);
    }
  };

  const removerProduto = async (uid) => {
    try {
      const res = await axios.delete(`${API}/remover/${uid}`);
      const novoCarrinho = res?.data?.carrinho ?? [];
      setCarrinho(novoCarrinho);
      mostrarNotificacao("Produto removido.", "sucesso");
      return res.data;
    } catch (err) {
      mostrarNotificacao("Erro ao remover item.", "erro");
      throw err;
    }
  };

  const limparCarrinho = async () => {
    try {
      await axios.delete(`${API}/limpar`);
      setCarrinho([]);
      mostrarNotificacao("Carrinho limpo.", "sucesso");
    } catch (err) {
      mostrarNotificacao("Erro ao limpar carrinho.", "erro");
      throw err;
    }
  };

  const atualizarQuantidade = (uid, novaQtd) => {
    setCarrinho((prev) =>
      prev.map((i) => (i.uid === uid ? { ...i, quantidade: novaQtd } : i))
    );
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarProduto,
        removerProduto,
        limparCarrinho,
        atualizarQuantidade,
      }}
    >
      {children}

      {/* 🔔 Notificação (sem bolinha vermelha) */}
      {notificacao && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            backgroundColor:
              notificacao.tipo === "erro" ? "#d9534f" : "#1b4332",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            fontWeight: 600,
          }}
        >
          {notificacao.mensagem}
        </div>
      )}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  return ctx;
}
