import React, { useState, useEffect } from "react";
import Modal from "../components/modal";
import PedidoForm from "../components/pedidoForm";
import axios from "axios";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const API_URL = "http://localhost:8000/api/admin/pedidos";

  // 🔹 Carregar pedidos do backend
  const carregarPedidos = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log("Pedidos carregados:", res.data);
      setPedidos(res.data.pedidos || []);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  // 🔹 Criar ou atualizar pedido
  const handleSave = async (pedido) => {
    try {
      if (pedidoSelecionado) {
        // Atualizar pedido existente
        await axios.put(`${API_URL}/${pedidoSelecionado.id_pedido}`, pedido);
      } else {
        // Criar novo pedido
        await axios.post(API_URL, pedido);
      }

      // Recarrega pedidos atualizados
      await carregarPedidos();
    } catch (err) {
      console.error("Erro ao salvar pedido:", err);
    }

    setModalOpen(false);
    setPedidoSelecionado(null);
  };

  // 🔹 Editar pedido
  const handleEdit = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  // 🔹 Excluir pedido
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setPedidos(pedidos.filter((p) => p.id_pedido !== id));
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
    }
  };

  // 🔹 Ver detalhes (exemplo simples)
  const handleView = (pedido) => {
    alert(`
      Endereço: ${pedido.endereco}
      Pagamento: ${pedido.forma_pagamento}
      Status: ${pedido.status_pagamento}
      Total: R$ ${Number(pedido.total).toFixed(2)}
    `);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛒 Gerenciar Pedidos</h2>
      <button onClick={() => setModalOpen(true)}>Adicionar Pedido</button>

      <table border="1" cellPadding="8" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Endereço</th>
            <th>Produtos</th>
            <th>Adicionais</th>
            <th>Valor Total</th>
            <th>Forma de Pagamento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length > 0 ? (
            pedidos.map((p) => (
              <tr key={p.id_pedido}>
                <td>{p.endereco}</td>
                <td>
                  {p.itens && p.itens.length > 0
                    ? p.itens
                        .map(
                          (item) =>
                            `${item.produto?.nome || "Produto"} (x${item.quantidade})`
                        )
                        .join(", ")
                    : "—"}
                </td>
                <td>
                  {p.itens && p.itens.length > 0
                    ? p.itens
                        .map((item) => {
                          const adicionaisArray = Array.isArray(item.adicionais)
                            ? item.adicionais
                            : [];
                          const nomesAdicionais = adicionaisArray
                            .map((a) => a.adicional?.nome)
                            .filter(Boolean)
                            .join(", ");
                          return nomesAdicionais || "—";
                        })
                        .join(" | ")
                    : "—"}
                </td>
                <td>R$ {Number(p.total).toFixed(2)}</td>
                <td>{p.forma_pagamento}</td>
                <td>{p.status_pagamento}</td>
                <td>
                  <button onClick={() => handleView(p)}>Ver</button>
                  <button onClick={() => handleEdit(p)}>Editar</button>
                  <button onClick={() => handleDelete(p.id_pedido)}>Excluir</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Nenhum pedido encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <Modal title="Pedido" onClose={() => setModalOpen(false)}>
          <PedidoForm onSubmit={handleSave} initialData={pedidoSelecionado} />
        </Modal>
      )}
    </div>
  );
}
