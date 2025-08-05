import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cardapio from "./../paginas/cardapio";
import Cadastro from "./../paginas/criar-cliente";
import App from "./../App";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
