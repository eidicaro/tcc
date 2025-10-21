import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/produtoForm.css";

export default function EditProdutoForm({ produtos, onSubmit, onDelete }) {
  const [categorias, setCategorias] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    id_categoria: "",
    imagem: null,
  });

  // Carregar categorias do backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Quando o usuário seleciona um produto
  const handleSelectChange = (e) => {
    const produtoId = e.target.value;
    const produto = produtos.find((p) => p.id_produto == produtoId);
    setProdutoSelecionado(produto);
    if (produto) {
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        id_categoria: produto.id_categoria || "",
        imagem: null,
      });
    }
  };

  // Atualizar campos do formulário
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Enviar atualização
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!produtoSelecionado) {
      alert("Selecione um produto para editar!");
      return;
    }
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") data.append(key, value);
    });
    onSubmit(produtoSelecionado.id_produto, data);
  };

  return (
    <form className="produto-form" onSubmit={handleSubmit}>
      <h3>Editar Produto</h3>

      {/* Seleção de produto */}
      <div className="form-group">
        <label>Selecione o Produto</label>
        <select onChange={handleSelectChange} defaultValue="">
          <option value="">-- Escolha um produto --</option>
          {produtos.map((p) => (
            <option key={p.id_produto} value={p.id_produto}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      {produtoSelecionado && (
        <>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Preço (R$)</label>
            <input
              type="number"
              name="preco"
              step="0.01"
              value={formData.preco}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <select
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
            >
              <option value="">-- Selecione uma categoria --</option>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Imagem (opcional)</label>
            <input
              type="file"
              name="imagem"
              accept="image/*"
              onChange={handleChange}
            />
            {produtoSelecionado.imagem_url && (
              <img
                src={produtoSelecionado.imagem_url}
                alt="preview"
                style={{ width: "100px", marginTop: "8px", borderRadius: "8px" }}
              />
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-salvar">
              Salvar Alterações
            </button>
            <button
              type="button"
              className="btn-excluir"
              onClick={() => onDelete(produtoSelecionado.id_produto)}
            >
              Excluir Produto
            </button>
          </div>
        </>
      )}
    </form>
  );
}
