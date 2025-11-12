import { useState, useEffect } from "react";

export default function PedidoForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    cliente: "",
    produtos: "",
    valorTotal: "",
    status: "",
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
    setForm({ cliente: "", produtos: "", valorTotal: "", status: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Cliente:</label>
      <input
        name="cliente"
        value={form.cliente}
        onChange={handleChange}
        required
      />

      <label>Produtos:</label>
      <textarea
        name="produtos"
        value={form.produtos}
        onChange={handleChange}
        required
      />

      <label>Valor Total:</label>
      <input
        name="valorTotal"
        type="number"
        step="0.01"
        value={form.valorTotal}
        onChange={handleChange}
        required
      />

      <label>Status:</label>
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        required
      >
        <option value="">Selecione</option>
        <option value="Pendente">Pendente</option>
        <option value="Pago">Pago</option>
        <option value="Enviado">Enviado</option>
        <option value="Entregue">Entregue</option>
      </select>

      <button type="submit">Salvar</button>
    </form>
  );
}
