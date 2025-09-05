import React, { useState } from "react";
import styled from "styled-components";
import Payment from "../modais/pagamento";

const Carrinho = () => {
  const [showCart, setShowCart] = useState(false);       // controla visibilidade do carrinho
  const [showPayment, setShowPayment] = useState(false); // controla modal de pagamento

  const subtotal = 91.8; // exemplo

  return (
    <Wrapper>
      {/* Botão do ícone do carrinho */}
      <div className="button-container">
        <button className="button" onClick={() => setShowCart(!showCart)}>
          <svg
            className="icon"
            stroke="currentColor"
            fill="none"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx={9} cy={21} r={1} />
            <circle cx={20} cy={21} r={1} />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>

      {/* Carrinho */}
      {showCart && (
        <Cart>
          {/* Itens do carrinho */}
          <p>Itens do carrinho...</p>

          {/* Botão para abrir modal de pagamento */}
          <button className="finalizar-btn" onClick={() => setShowPayment(true)}>
            Finalizar Pedido
          </button>
        </Cart>
      )}

      {/* Modal de pagamento */}
      {showPayment && <Payment subtotal={subtotal} onClose={() => setShowPayment(false)} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;

  .button-container {
    display: flex;
    background-color: black;
    width: 250px;
    height: 40px;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
  }

  .button {
    outline: 0 !important;
    border: 0 !important;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: all ease-in-out 0.3s;
    cursor: pointer;
  }

  .button:hover { transform: translateY(-3px); }
  .icon { font-size: 50px; }
`;

const Cart = styled.div`
  position: absolute; 
  top: 60px; 
  right: 0;
  width: 300px;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  z-index: 10;

  .finalizar-btn {
    margin-top: 10px;
    width: 100%;
    padding: 12px;
    background: #043d16;
    color: #fff;
    border: none;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
  }
  .finalizar-btn:hover {
    background: #03520f;
  }
`;

export default Carrinho;
