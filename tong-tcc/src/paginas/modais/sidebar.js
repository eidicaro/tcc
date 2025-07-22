import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Sidebar() {
  const [categorias, setCategorias] = useState([]);

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
    <div
      className="sidebar-custom d-flex flex-column p-3 text-white"
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
            <a href={`#${c.nome?.toLowerCase().replace(/\s/g, '-')}`} className="nav-link text-white">
              {c.nome}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
