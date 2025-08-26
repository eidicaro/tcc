import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cardapio from "../paginas/cardapio";
import AdminDashboard from "./../paginas/adminDashboard";
import App from '../App'
import Login from "../paginas/login";
import PrivateRoute from "../paginas/privateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Quando acessar "/" já redireciona para /login */}
        <Route path="/" element={<App />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="*" element={<h1 style={{ padding: 24 }}>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}