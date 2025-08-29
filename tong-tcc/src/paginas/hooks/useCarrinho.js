import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
const API = 'http://localhost:8000/api/carrinho';

export function useCarrinho() {
  const [carrinho, setCarrinho] = useState([]);

  // Busca carrinho da session ao montar o hook
  useEffect(() => {
    axios.get(`${API}/listar`)
      .then(res => setCarrinho(res.data.carrinho))
      .catch(err => console.error('Erro ao carregar carrinho:', err));
  }, []);

  const adicionarProduto = (produto) => {
    axios.post(`${API}/adicionar`, { produto })
      .then(res => setCarrinho(res.data.carrinho))
      .catch(err => console.error('Erro ao adicionar produto:', err));
  };

  const removerProduto = (uid) => {
    axios.delete(`${API}/remover/${uid}`)
      .then(res => setCarrinho(res.data.carrinho))
      .catch(err => console.error('Erro ao remover produto:', err));
  };

  const limparCarrinho = () => {
    axios.delete(`${API}/limpar`)
      .then(res => setCarrinho([]))
      .catch(err => console.error('Erro ao limpar carrinho:', err));
  };

  return { carrinho, adicionarProduto, removerProduto, limparCarrinho };
}
