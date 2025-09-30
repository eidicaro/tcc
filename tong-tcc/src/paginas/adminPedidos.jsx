import React, { useState, useEffect } from "react";
import Modal from "../components/modal";
import PedidoForm from "../components/pedidoForm";
import axios from "axios";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // Carregar pedidos do backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/pedidos") // ajuste para sua rota real
      .then((res) => {
        console.log("API:", res.data); // Para depuração
        setPedidos(res.data.pedidos || []); // Pega o array de pedidos
      })
      .catch((err) => console.error("Erro ao carregar pedidos:", err));
  }, []);

  const handleSave = async (pedido) => {
    try {
      if (pedidoSelecionado) {
        // Atualizar pedido
        const res = await axios.put(
          `http://localhost:8000/api/pedidos/${pedidoSelecionado.id_pedido}`,
          pedido
        );
        setPedidos(
          pedidos.map((p) =>
            p.id_pedido === pedidoSelecionado.id_pedido ? res.data : p
          )
        );
      } else {
        // Criar novo pedido
        const res = await axios.post(
          "http://localhost:8000/api/pedidos",
          pedido
        );
        setPedidos([...pedidos, res.data]);
      }
    } catch (err) {
      console.error("Erro ao salvar pedido:", err);
    }
    setModalOpen(false);
    setPedidoSelecionado(null);
  };

  const handleEdit = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/pedidos/${id}`);
      setPedidos(pedidos.filter((p) => p.id_pedido !== id));
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gerenciar Pedidos</h2>
      <button onClick={() => setModalOpen(true)}>Adicionar Pedido</button>

      <table
      border="1"
      cellPadding="8"
      style={{ marginTop: 20, width: "100%" }}
    >
      <thead>
        <tr>
          <th>Endereço</th>
          <th>Produtos</th>
          <th>Adicionais</th> {/* Nova coluna */}
          <th>Valor Total</th>
          <th>Forma de Pagamento</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map((p) => (
          <tr key={p.id_pedido}>
            <td>{p.endereco}</td>
            <td>
              {p.itens && p.itens.length > 0
                ? p.itens.map((item) => `${item.produto?.nome} (x${item.quantidade})`).join(", ")
                : "—"}
            </td>
            <td>
              {p.itens && p.itens.length > 0
                ? p.itens
                    .map((item) => {
                      const adicionaisArray = Array.isArray(item.adicionais) ? item.adicionais : [];
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
              <button onClick={() => handleEdit(p)}>Editar</button>
              <button onClick={() => handleDelete(p.id_pedido)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
</table>


      {modalOpen && (
        <Modal title="Pedido" onClose={() => setModalOpen(false)}>
          <PedidoForm
            onSubmit={handleSave}
            initialData={pedidoSelecionado}
          />
        </Modal>
      )}
    </div>
  );
}
