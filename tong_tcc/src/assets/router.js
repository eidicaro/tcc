import { BrowserRouter as Routes, Route } from "react-router-dom";
import Cardapio from "./../paginas/cardapio";
import App from "./../App"

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cardapio" element={<Cardapio />} />
      </Routes>
  );
};

export default AppRoutes;
