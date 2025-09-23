import React, { useState, useEffect } from "react";

export default function ClienteForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
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
    setForm({ nome: "", email: "", telefone: "", endereco: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nome:</label>
      <input name="nome" value={form.nome} onChange={handleChange} required />

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label>Telefone:</label>
      <input
        name="telefone"
        value={form.telefone}
        onChange={handleChange}
        required
      />

      <label>Endereço:</label>
      <input
        name="endereco"
        value={form.endereco}
        onChange={handleChange}
        required
      />

      <button type="submit">Salvar</button>
    </form>
  );
}
