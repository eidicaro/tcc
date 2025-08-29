// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../style.css';
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Sidebar() {
//   const [categorias, setCategorias] = useState([]);


//   // carrega as categorias
//   useEffect(() => {
//     axios.get('http://localhost:8000/api/categoria')
//       .then(res => {
//         setCategorias(res.data);
//       })
//       .catch(err => {
//         console.error("Erro ao buscar categorias:", err);
//       });
//   }, []);

//   return (
//     <div
//       className="sidebar-custom d-flex flex-column p-3 text-white"
//       style={{
//         width: '15%',
//         backgroundColor: '#f37030',
//         position: 'fixed',
//         height: '100vh',
//         overflowY: 'scroll',
//       }}
//     >
//       <ul className="nav flex-column">
//         {categorias.map((c) => (
//           <li className="nav-item-cardapio" key={c.id_categoria}>
//             <a href={`#${c.nome?.toLowerCase().replace(/\s/g, '-')}`} className="nav-link text-white">
//               {c.nome}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Sidebar() {
  const [categorias, setCategorias] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // carrega as categorias
  useEffect(() => {
    axios.get('http://localhost:8000/api/categoria')
      .then(res => {
        setCategorias(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar categorias:", err);
      });
  }, []);

  return (
    <>
      {/* 🔹 Sidebar Desktop (não muda) */}
      <div
        className="sidebar-custom d-none d-lg-flex flex-column p-3 text-white"
        style={{
          width: '15%',
          backgroundColor: '#f37030',
          position: 'fixed',
          height: '100vh',
          overflowY: 'scroll',
        }}
      >
        <ul className="nav flex-column">
          {categorias.map((c) => (
            <li className="nav-item-cardapio" key={c.id_categoria}>
              <a
                href={`#${c.nome?.toLowerCase().replace(/\s/g, '-')}`}
                className="nav-link text-white"
              >
                {c.nome}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Botão Mobile */}
      <button className="menu-toggle d-lg-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* 🔹 Sidebar Mobile */}
      <div className={`mobile-sidebar ${isOpen ? 'active' : ''}`}>
        <ul className="nav flex-column">
          {categorias.map((c) => (
            <li className="nav-item-cardapio" key={c.id_categoria} onClick={() => setIsOpen(false)}>
              <a
                href={`#${c.nome?.toLowerCase().replace(/\s/g, '-')}`}
                className="nav-link text-white"
              >
                {c.nome}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

