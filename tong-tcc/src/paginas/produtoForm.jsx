import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/produtoForm.css";

export default function ProdutoForm({ onSubmit, initialData }) {
  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    id_categoria: "",
    imagem: null,
  });

  const [categorias, setCategorias] = useState([]);

  // Carregar categorias do backend
  useEffect(() => {
    axios.get("http://localhost:8000/api/categoria")
      .then(res => setCategorias(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (initialData) {
      setProduto({
        nome: initialData.nome || "",
        descricao: initialData.descricao || "",
        preco: initialData.preco || "",
        id_categoria: initialData.id_categoria || "",
        imagem: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", produto.nome);
    formData.append("descricao", produto.descricao);
    formData.append("preco", produto.preco);
    formData.append("id_categoria", produto.id_categoria);
    if (produto.imagem) formData.append("imagem", produto.imagem);

    onSubmit(formData);
  };

  return (
    <form className="produto-form" onSubmit={handleSubmit}>
      <label>Nome:</label>
      <input type="text" name="nome" value={produto.nome} onChange={handleChange} required />

      <label>Preço:</label>
      <input type="number" step="0.01" name="preco" value={produto.preco} onChange={handleChange} required />

      <select name="id_categoria" value={produto.id_categoria} onChange={handleChange} required>
      <option value="">Selecione uma categoria</option>
      {categorias.map(cat => (
        <option key={cat.id_categoria} value={cat.id_categoria}>
          {cat.nome}
        </option>
      ))}
    </select>


      <label>Descrição:</label>
      <textarea name="descricao" value={produto.descricao} onChange={handleChange} required />

      <label>Imagem:</label>
      <input type="file" name="imagem" accept="image/*" onChange={handleChange} />

      <button type="submit" className="save-btn">{initialData ? "Atualizar Produto" : "Salvar Produto"}</button>
    </form>
  );
}
