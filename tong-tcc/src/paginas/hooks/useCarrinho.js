import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
const API = 'http://localhost:8000/api/carrinho';

export function useCarrinho() {
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    axios.get(`${API}/listar`)
      .then(res => setCarrinho(res.data.carrinho || []))
      .catch(err => console.error('Erro ao carregar carrinho:', err));
  }, []);

  // normaliza adicionais: agrega duplicatas e força preco/quantidade numéricos
  // const _normalizaAdicionais = (adicionais = []) => {
  //   const mapa = {};
  //   adicionais.forEach(ad => {
  //     const key = ad.id_adicional ?? ad.id ?? ad.nome;
  //     const preco = Number(ad.preco || 0);
  //     const qtd = Number(ad.quantidade || 1);

  //     if (!mapa[key]) {
  //       mapa[key] = {
  //         ...(ad.id_adicional ? { id_adicional: ad.id_adicional } : {}),
  //         nome: ad.nome,
  //         preco,
  //         quantidade: qtd
  //       };
  //     } else {
  //       mapa[key].quantidade += qtd;
  //     }
  //   });
  //   return Object.values(mapa);
  // };

  // adiciona produto (espera receber preco DO PRODUTO POR UNIDADE + adicionais com quantidade por unidade)
  const adicionarProduto = (produto) => {
    const produtoFormatado = {
      ...produto,
      preco: Number(produto.preco || 0),
      quantidade: Number(produto.quantidade || 1),
      adicionais: (produto.adicionais || []).map(a => ({
        id_adicional: a.id_adicional,
        nome: a.nome,
        preco: Number(a.preco || 0),
        quantidade: Number(a.quantidade || 1)
      }))
    };
  
    return axios.post("http://localhost:8000/api/carrinho/adicionar", { produto: produtoFormatado })
      .then(res => {
        setCarrinho(res.data.carrinho || []);
        return res.data;
      })
      .catch(err => {
        console.error("Erro ao adicionar produto:", err);
        throw err;
      });
  };
  


  const removerProduto = (uid) => {
    axios.delete(`${API}/remover/${uid}`)
      .then(res => setCarrinho(res.data.carrinho || []))
      .catch(err => console.error('Erro ao remover produto:', err));
  };

  const limparCarrinho = () => {
    axios.delete(`${API}/limpar`)
      .then(() => setCarrinho([]))
      .catch(err => console.error('Erro ao limpar carrinho:', err));
  };

  // ATENÇÃO: isso altera apenas o estado local. Se quiser persistir no back, precisa endpoint.
  const atualizarQuantidade = (uid, novaQtd) => {
    setCarrinho(prev =>
      prev.map(item =>
        item.uid === uid ? { ...item, quantidade: novaQtd } : item
      )
    );
  };

  return { carrinho, adicionarProduto, removerProduto, limparCarrinho, atualizarQuantidade };
}
