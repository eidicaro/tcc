import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cardapio from "./../paginas/cardapio";
import App from "./../App";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cardapio" element={<Cardapio />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
