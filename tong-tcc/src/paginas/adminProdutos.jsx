import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/modal";
import ProdutoForm from "./produtoForm.jsx";
import EditProdutoForm from "./editProdutoForm.jsx";
import "./../styles/adminProdutos.css";

export default function ProdutosPage() {
  const [modalOpen, setModalOpen] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // Carregar produtos do backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Criar produto
  const handleSave = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/admin/produtos",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProdutos((prev) => [...prev, res.data]);
      setModalOpen(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar produto!");
    }
  };

  // Atualizar produto
  const handleUpdate = async (id, formData) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/admin/produtos/${id}?_method=PUT`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProdutos((prev) =>
        prev.map((p) => (p.id_produto === id ? res.data : p))
      );
      setModalOpen(null);
      setProdutoSelecionado(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar produto!");
    }
  };

  // Excluir produto
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/produtos/${id}`);
      setProdutos((prev) => prev.filter((p) => p.id_produto !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir produto!");
    }
  };

  return (
    <div className="produtos-container">

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
        VOLTAR
      </button>


      {/* Card principal */}
      <div className="produtos-card">
        <h2>PRODUTOS</h2>
        <div className="produtos-buttons">
          <button onClick={() => setModalOpen("criar")}>CRIAR PRODUTO</button>
          <button onClick={() => setModalOpen("editar")}>EDITAR PRODUTO</button>
        </div>
      </div>

      {/* Modal Criar Produto */}
      {modalOpen === "criar" && (
        <Modal
          title="CRIAR PRODUTO"
          onClose={() => setModalOpen(null)}
        >
          <ProdutoForm onSubmit={handleSave} />
        </Modal>
      )}

      {/* Modal Editar Produto */}
      {modalOpen === "editar" && (
        <Modal
          title="EDITAR PRODUTO"
          onClose={() => {
            setModalOpen(null);
            setProdutoSelecionado(null);
          }}
        >
          <EditProdutoForm
            produtos={produtos}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </div>
  );
}
