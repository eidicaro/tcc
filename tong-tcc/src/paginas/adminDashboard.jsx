import { Link, useNavigate } from "react-router-dom";
import "./../styles/adminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("http://localhost:8000/api/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => navigate("/login"));
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>
          Bem-Vindo à <span>Página do Administrador</span>
        </h1>
        <div className="underline"></div>
      </header>

      <main className="admin-main">
        <Link to="/admin/produtos" className="card">PRODUTOS</Link>
        <Link to="/admin/pedidos" className="card">PEDIDOS</Link>
        <Link to="/admin/clientes" className="card">CLIENTES</Link>
      </main>

      <footer>
        <button className="logout" onClick={handleLogout}>
          SAIR
        </button>
      </footer>
    </div>
  );
}

