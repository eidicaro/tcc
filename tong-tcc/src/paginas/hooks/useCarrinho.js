import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api/carrinho';

axios.defaults.withCredentials = true;

export function useCarrinho() {
  const [carrinho, setCarrinho] = useState([]);

  // busca carrinho inicial do backend
  useEffect(() => {
    const fetchCarrinho = async () => {
      try {
        // pega cookie CSRF
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
        const res = await axios.get(API, { withCredentials: true });
        setCarrinho(res.data.carrinho || []);
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err);
      }
    };
    fetchCarrinho();
  }, []);

  // adiciona produto
  const adicionarProduto = async (produto) => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

      const res = await axios.post(
        `http://localhost:8000/api/carrinho/adicionar`,
        { produto },
        { withCredentials: true }
      );

      setCarrinho(res.data.carrinho || []);
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
    }
  };

  // remove produto pelo UID
  const removerProduto = async (uid) => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      const res = axios.delete(`http://localhost:8000/carrinho/remover/${uid}`, { withCredentials: true });
      setCarrinho(res.data.carrinho || []);
    } catch (err) {
      console.error('Erro ao remover produto:', err);
    }
  };

  // limpa carrinho
  const limparCarrinho = async () => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
      const res = axios.delete(`http://localhost:8000/carrinho/limpar`, { withCredentials: true });

      setCarrinho([]);
    } catch (err) {
      console.error('Erro ao limpar carrinho:', err);
    }
  };

  return { carrinho, adicionarProduto, removerProduto, limparCarrinho };
}
