import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Sidebar() {
  return (
    <div className="d-flex flex-column vh-100 p-3 text-white" style={{ width: '220px', backgroundColor: '#f37030'}}>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item-cardapio">
          <a href="#entradas" className="nav-link text-white">Entradas</a>
        </li>
        <li className="nav-item-cardapio">
          <a href="#pokes" className="nav-link text-white">Pokes</a>
        </li>
        <li className="nav-item-cardapio">
          <a href="#combinados" className="nav-link text-white">Combinados</a>
        </li>
        <li className="nav-item-cardapio">
          <a href="#sushis" className="nav-link text-white">Sushis</a>
        </li>
        <li className="nav-item-cardapio">
          <a href="#temakis" className="nav-link text-white">Temakis</a>
        </li>
        <li className="nav-item-cardapio">
          <a href="#pratos-quentes" className="nav-link text-white">Pratos Quentes</a>
        </li>
        <li className="nav-item-cardapio">
          <a href="#hotrolls" className="nav-link text-white">Hotrolls</a>
        </li>
        <li className="nav-item-cardapio">
          <a href="#bebidas" className="nav-link text-white">Bebidas</a>
        </li>
        <li className="nav-item-cardapio">
          <a href="#sobremesas" className="nav-link text-white">Sobremesas</a>
        </li>
      </ul>
    </div>
  );
}
