import { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/adminClientes.css";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/clientes")
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Erro ao carregar clientes:", err));
  }, []);

  return (
    <div className="clientes-container">
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

      <div className="clientes-card">
        <h2>CLIENTES</h2>

        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.telefone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="sem-clientes">
                  Nenhum cliente cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
