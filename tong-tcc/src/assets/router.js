import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cardapio from "../paginas/cardapio";
import AdminDashboard from "./../paginas/adminDashboard";
import App from '../App';
import Login from "../paginas/login";
import PrivateRoute from "../paginas/privateRoute";

import ProdutosPage from "../paginas/adminProdutos";
import PedidosPage from "../paginas/adminPedidos";
import ClientesPage from "../paginas/adminClientes";
import GerenciarPage from "../paginas/adminGerenciarItens";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/produtos"
          element={
            <PrivateRoute>
              <ProdutosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <PrivateRoute>
              <PedidosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <PrivateRoute>
              <ClientesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/gerenciaritens"
          element={
            <PrivateRoute>
              <GerenciarPage />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={<h1 style={{ padding: 24 }}>404 - Página não encontrada</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}
