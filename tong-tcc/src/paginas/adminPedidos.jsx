import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/adminPedidos.css";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState([]);
  const [statusEditando, setStatusEditando] = useState({});



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

  // const abrirModalEdicao = (item) => {
  //   setProdutoEditando(item);
  //   setQuantidade(item.quantidade || 1);
  //   setAdicionaisSelecionados(item.adicionais?.map((a) => a.id_adicional) || []);
  // };

  const fecharModalEdicao = () => {
    setProdutoEditando(null);
    setQuantidade(1);
    setAdicionaisSelecionados([]);
  };

  const salvarEdicao = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/pedidos/${produtoEditando.id_pedido}/produto/${produtoEditando.id_produto}`,
        { quantidade, adicionais: adicionaisSelecionados }
      );
      carregarPedidos();
      fecharModalEdicao();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  // 🔹 Atualiza apenas o status do pedido
  const atualizarStatus = async (id_pedido, novoStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/pedidos/${id_pedido}/status`,
        { status_pagamento: novoStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      setPedidos((prev) =>
        prev.map((p) =>
          p.id_pedido === id_pedido ? { ...p, status_pagamento: novoStatus } : p
        )
      );


    } catch (error) {
      console.error("Erro ao atualizar status:", error.response?.data || error);
    }
  };




  const toggleAdicional = (id) => {
    setAdicionaisSelecionados((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="admin-container">

       {/* Botão sair */}
       <button
        className="logout-btn"
        onClick={() => {
          fetch("http://localhost:8000/api/logout", {
            method: "POST",
            credentials: "include",
          }).finally(() => (window.location.href = "/admin"));
        }}
      >
        SAIR
      </button>


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

                  {/* 🔹 Campo de edição de status */}
                  <td>
                    <select
                      value={statusEditando[pedido.id_pedido] ?? pedido.status_pagamento}
                      onChange={(e) =>
                        setStatusEditando({
                          ...statusEditando,
                          [pedido.id_pedido]: e.target.value,
                        })
                      }
                    >
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <button
                      className="btn-salvar-status"
                      onClick={() =>
                        atualizarStatus(
                          pedido.id_pedido,
                          statusEditando[pedido.id_pedido] ?? pedido.status_pagamento
                        )
                      }
                    >
                      Salvar
                    </button>
                  </td>

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
                      className="btn-excluir"
                      onClick={() => excluirPedido(pedido.id_pedido)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>

                {/* Itens do pedido */}
                <tr>
                  <td colSpan="7" className="detalhes-produtos">
                    {pedido.itens?.length > 0 ? (
                      pedido.itens.map((item) => (
                        <div key={item.id} className="produto-item">
                          <div className="produto-header">
                            <strong>{item.produto?.nome}</strong>
                            <span> x{item.quantidade}</span>
                            <span className="preco-produto">
                              — R$ {parseFloat(item.preco_unitario).toFixed(2)}
                            </span>
                          </div>

                          {item.adicionais?.length > 0 && (
                            <div className="adicionais-container">
                              <p className="titulo-adicionais">Adicionais:</p>
                              <ul className="adicionais-lista">
                                {item.adicionais.map((ad) => (
                                  <li key={ad.id}>
                                    {ad.adicional?.nome} <span>x{ad.quantidade}</span> — R$
                                    {parseFloat(ad.preco_unitario).toFixed(2)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Nenhum item encontrado neste pedido.</p>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edição de produto */}
      {produtoEditando && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Produto: {produtoEditando.produto?.nome}</h3>
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
                {produtoEditando.adicionais.map((ad) => (
                  <label key={ad.id}>
                    <input
                      type="checkbox"
                      checked={adicionaisSelecionados.includes(ad.id_adicional)}
                      onChange={() => toggleAdicional(ad.id_adicional)}
                    />
                    {ad.adicional?.nome} — R$
                    {parseFloat(ad.preco_unitario).toFixed(2)}
                  </label>
                ))}
              </div>
            )}

            <div className="modal-botoes">
              <button className="btn salvar" onClick={salvarEdicao}>
                Salvar
              </button>
              <button className="btn cancelar" onClick={fecharModalEdicao}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPedidos;
