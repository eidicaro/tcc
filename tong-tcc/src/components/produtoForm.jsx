import React, { useState, useEffect } from "react";

export default function ProdutoForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    categoria: "",
    descricao: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ nome: "", preco: "", categoria: "", descricao: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nome:</label>
      <input name="nome" value={form.nome} onChange={handleChange} required />

      <label>Preço:</label>
      <input
        name="preco"
        type="number"
        step="0.01"
        value={form.preco}
        onChange={handleChange}
        required
      />

      <label>Categoria:</label>
      <input
        name="categoria"
        value={form.categoria}
        onChange={handleChange}
        required
      />

      <label>Descrição:</label>
      <textarea
        name="descricao"
        value={form.descricao}
        onChange={handleChange}
      />

      <button type="submit">Salvar</button>
    </form>
  );
}
