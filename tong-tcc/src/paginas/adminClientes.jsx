import React, { useState } from "react";
import Modal from "../components/modal";
import ClienteForm from "../components/clienteForm";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const handleSave = (cliente) => {
    if (clienteSelecionado) {
      setClientes(
        clientes.map((c) =>
          c.id === clienteSelecionado.id ? { ...cliente, id: c.id } : c
        )
      );
    } else {
      setClientes([...clientes, { ...cliente, id: Date.now() }]);
    }
    setModalOpen(false);
    setClienteSelecionado(null);
  };

  const handleEdit = (cliente) => {
    setClienteSelecionado(cliente);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setClientes(clientes.filter((c) => c.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gerenciar Clientes</h2>
      <button onClick={() => setModalOpen(true)}>Adicionar Cliente</button>

      <table border="1" cellPadding="8" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.email}</td>
              <td>{c.telefone}</td>
              <td>{c.endereco}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Editar</button>
                <button onClick={() => handleDelete(c.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <Modal title="Cliente" onClose={() => setModalOpen(false)}>
          <ClienteForm onSubmit={handleSave} initialData={clienteSelecionado} />
        </Modal>
      )}
    </div>
  );
}
