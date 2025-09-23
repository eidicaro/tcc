import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const PaymentPage = ({ subtotal, onClose, carrinho }) => {
  const [deliveryFee] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");

  const total = Number(subtotal) + Number(deliveryFee);

  useEffect(() => {
    // pega CSRF cookie antes de enviar qualquer POST
    axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
  }, []);

  const handlePayment = async () => {
    if (!address.trim() || !paymentMethod) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/pedidos/finalizar",
        { endereco: address, forma_pagamento: paymentMethod, total, carrinho },
        { withCredentials: true } // garante que o cookie CSRF seja enviado
      );

      alert("Pedido realizado com sucesso! ID: " + response.data.pedido_id);
      onClose();
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Erro ao finalizar pedido");
    }
  };

  const isPayDisabled = !address.trim() || !paymentMethod;

  return (
    <Overlay>
      <Card>
        <Header>
          <h2>Finalizar pedido</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </Header>

        <Content>
          <SmallNote>Hoje: 40 - 60 min</SmallNote>

          <Field>
            <label>Endereço</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </Field>

          <Field>
            <label>Forma de Pagamento</label>
            <Options>
              {["Cartão Débito/Crédito", "Pix", "Dinheiro"].map(m => (
                <Option key={m}>
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                  <span>{m}</span>
                </Option>
              ))}
            </Options>
          </Field>
        </Content>

        <Footer>
          <Totals>
            <div>
              <span>Subtotal:</span>
              <strong>R$ {subtotal.toFixed(2)}</strong>
            </div>
            <div>
              <span>Taxa de entrega:</span>
              <strong>R$ {deliveryFee.toFixed(2)}</strong>
            </div>
            <hr />
            <div className="total-row">
              <span>Total:</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          </Totals>

          <PayButton onClick={handlePayment} disabled={isPayDisabled}>
            Realizar Pagamento
          </PayButton>
        </Footer>
      </Card>
    </Overlay>
  );
};

export default PaymentPage;

// ================== STYLED COMPONENTS ==================

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
`;

const Card = styled.div`
  width: 760px;
  max-width: calc(100% - 48px);
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #e9e9e9;
  padding: 18px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  h2 { margin: 0; font-weight: 700; }

  .close-btn {
    position: absolute;
    right: 18px;
    top: 14px;
    border: none;
    background: transparent;
    font-size: 22px;
    cursor: pointer;
  }
`;

const Content = styled.div`
  padding: 18px 28px;
  background: #ececec;
`;

const SmallNote = styled.div`
  color: #333;
  margin-bottom: 12px;
  font-size: 14px;
`;

const Field = styled.div`
  margin-top: 14px;
  label { display: block; margin-bottom: 8px; font-weight: 600; }
  input[type="text"] {
    width: 100%;
    height: 14px;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #cfcfcf;
  }
`;

const Options = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    margin-right: 8px; /* espaço entre bolinha e texto */
  }
`;

const Footer = styled.div`
  background: #f07f2d; /* laranja da sua imagem */
  padding: 18px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Totals = styled.div`
  color: #fff;
  div { display:flex; justify-content: space-between; align-items:center; margin:6px 0; }
  hr { border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 8px 0; }
  .total-row { font-weight: 700; font-size: 18px; }
`;

const PayButton = styled.button`
  align-self: center;
  width: 260px;
  padding: 12px 16px;
  background: #0b4e31; /* verde */
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
