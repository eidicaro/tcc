import React, { useState } from 'react';
import axios from 'axios';

export default function LoginCadastro() {
  const [form, setForm] = useState({ nome: '', telefone: '', email: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cadastrar = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/clientes/cadastrar', form);
      salvarClienteELigarCarrinho(response.data.id_cliente);
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar cliente");
    }
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/clientes/login', {
        email: form.email
      });
      salvarClienteELigarCarrinho(response.data.id_cliente);
    } catch (err) {
      console.error(err);
      alert("Erro ao fazer login");
    }
  };

  const salvarClienteELigarCarrinho = async (idCliente) => {
    localStorage.setItem('id_cliente', idCliente);

    try {
      const response = await axios.post('http://localhost:8000/api/carrinho/criar', {
        id_cliente: idCliente
      });
      localStorage.setItem('id_carrinho', response.data.id_carrinho);
      alert("Carrinho ativo!");
    } catch (err) {
      console.error("Erro ao criar carrinho", err);
    }
  };

  return (
    <div>
      <h2>Cadastro/Login</h2>
      <input name="nome" placeholder="Nome" onChange={handleChange} />
      <input name="telefone" placeholder="Telefone" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <br />
      <button onClick={cadastrar}>Cadastrar</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
