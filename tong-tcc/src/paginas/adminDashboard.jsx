// import React from "react";
import "./../styles/adminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>
          Bem-Vindo à <span>Página do Administrador</span>
        </h1>
        <div className="underline"></div>
      </header>

      <main className="admin-main">
        <div className="card">PRODUTOS</div>
        <div className="card">PEDIDOS</div>
        <div className="card">CLIENTES</div>
      </main>

      <footer>
        <button
          className="logout"
          onClick={() => {
            fetch("http://localhost:8000/api/logout", {
              method: "POST",
              credentials: "include",
            }).finally(() => (window.location.href = "/login"));
          }}
        >
          SAIR
        </button>
      </footer>
    </div>
  );
}
