import React, { useState } from "react";
import Modal from "../components/modal";
import PedidoForm from "../components/pedidoForm";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const handleSave = (pedido) => {
    if (pedidoSelecionado) {
      setPedidos(
        pedidos.map((p) =>
          p.id === pedidoSelecionado.id ? { ...pedido, id: p.id } : p
        )
      );
    } else {
      setPedidos([...pedidos, { ...pedido, id: Date.now() }]);
    }
    setModalOpen(false);
    setPedidoSelecionado(null);
  };

  const handleEdit = (pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setPedidos(pedidos.filter((p) => p.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gerenciar Pedidos</h2>
      <button onClick={() => setModalOpen(true)}>Adicionar Pedido</button>

      <table border="1" cellPadding="8" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Produtos</th>
            <th>Valor Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.cliente}</td>
              <td>{p.produtos}</td>
              <td>{p.valorTotal}</td>
              <td>{p.status}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
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
