import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/adminPedidos.css";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState([]);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/pedidos");
      setPedidos(response.data.pedidos || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  };

  const excluirPedido = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/pedidos/${id}`);
      carregarPedidos();
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
    }
  };

  const abrirModalEdicao = (produto) => {
    setProdutoEditando(produto);
    setQuantidade(produto.pivot?.quantidade || 1);
    setAdicionaisSelecionados(produto.adicionais?.map(a => a.id_nome) || []);
  };

  const fecharModalEdicao = () => {
    setProdutoEditando(null);
    setQuantidade(1);
    setAdicionaisSelecionados([]);
  };

  const salvarEdicao = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/pedidos/${produtoEditando.pivot.id_pedido}/produto/${produtoEditando.id_nome}`,
        { quantidade, adicionais: adicionaisSelecionados }
      );
      carregarPedidos();
      fecharModalEdicao();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  const toggleAdicional = (id) => {
    setAdicionaisSelecionados(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="admin-container">
      <h2 className="titulo-admin">Pedidos Recebidos</h2>

      <div className="tabela-container">
        <table className="tabela-pedidos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Endereço</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th>Total</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <React.Fragment key={pedido.id_pedido}>
                <tr className="pedido-principal">
                  <td>{pedido.id_pedido}</td>
                  <td>{pedido.endereco}</td>
                  <td>{pedido.forma_pagamento}</td>
                  <td>{pedido.status_pagamento}</td>
                  <td>R$ {parseFloat(pedido.total).toFixed(2)}</td>
                  <td>
                    {new Date(pedido.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <button
                      className="btn excluir"
                      onClick={() => excluirPedido(pedido.id_pedido)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>

                {/* Produtos e adicionais */}
                <tr>
                  <td colSpan="7" className="detalhes-produtos">
                    {pedido.produtos?.length > 0 ? (
                      pedido.produtos.map((produto) => (
                        <div key={produto.id_nome} className="produto-item">
                          <div className="produto-header">
                            <strong>{produto.nome}</strong> — R$ {parseFloat(produto.preco).toFixed(2)}
                            {produto.pivot?.quantidade && <span> x{produto.pivot.quantidade}</span>}
                            <button className="btn editar" onClick={() => abrirModalEdicao(produto)}>
                              Editar
                            </button>
                          </div>

                          {produto.adicionais?.length > 0 && (
                            <ul className="adicionais-lista">
                              {produto.adicionais.map((adicional) => (
                                <li key={adicional.id_nome}>
                                  {adicional.nome} — R$ {parseFloat(adicional.preco).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Nenhum produto encontrado neste pedido.</p>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {produtoEditando && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Produto: {produtoEditando.nome}</h3>
            <label>
              Quantidade:
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value))}
              />
            </label>

            {produtoEditando.adicionais?.length > 0 && (
              <div className="adicionais-edicao">
                <p>Adicionais:</p>
                {produtoEditando.adicionais.map((adicional) => (
                  <label key={adicional.id_nome}>
                    <input
                      type="checkbox"
                      checked={adicionaisSelecionados.includes(adicional.id_nome)}
                      onChange={() => toggleAdicional(adicional.id_nome)}
                    />
                    {adicional.nome} — R$ {parseFloat(adicional.preco).toFixed(2)}
                  </label>
                ))}
              </div>
            )}

            <div className="modal-botoes">
              <button className="btn salvar" onClick={salvarEdicao}>Salvar</button>
              <button className="btn cancelar" onClick={fecharModalEdicao}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPedidos;
