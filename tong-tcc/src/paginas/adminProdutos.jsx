import React, { useState } from "react";
import Modal from "../components/modal";
import ProdutoForm from "../components/produtoForm";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const handleSave = (produto) => {
    if (produtoSelecionado) {
      setProdutos(
        produtos.map((p) =>
          p.id === produtoSelecionado.id ? { ...produto, id: p.id } : p
        )
      );
    } else {
      setProdutos([...produtos, { ...produto, id: Date.now() }]);
    }
    setModalOpen(false);
    setProdutoSelecionado(null);
  };

  const handleEdit = (produto) => {
    setProdutoSelecionado(produto);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gerenciar Produtos</h2>
      <button onClick={() => setModalOpen(true)}>Adicionar Produto</button>

      <table border="1" cellPadding="8" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.preco}</td>
              <td>{p.categoria}</td>
              <td>{p.descricao}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <Modal title="Produto" onClose={() => setModalOpen(false)}>
          <ProdutoForm onSubmit={handleSave} initialData={produtoSelecionado} />
        </Modal>
      )}
    </div>
  );
}
