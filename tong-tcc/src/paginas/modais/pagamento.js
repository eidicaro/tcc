import React, { useState } from "react";
import styled from "styled-components";

const Payment = ({ subtotal, onClose }) => {
  const [deliveryFee] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("");

  const total = subtotal + deliveryFee;

  // Evita o re-render infinito se alguém clicar sem querer
  const handlePayment = () => {
    alert(`Pagamento de R$${total.toFixed(2)} realizado!`);
    onClose();
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <h2>Finalizar pedido</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </Header>

        <Section>
          <label>Adicione uma localização</label>
          <input type="text" placeholder="Digite seu endereço..." />
        </Section>

        <Section>
          <label>Selecione uma forma de Pagamento</label>
          <Options>
            {["Cartão Débito/Crédito", "Pix", "Boleto", "Dinheiro"].map((method) => (
              <Option key={method}>
                <input
                  type="radio"
                  id={method}
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                <label htmlFor={method}>{method}</label>
              </Option>
            ))}
          </Options>
        </Section>

        <Summary>
          <Row>
            <span>Subtotal:</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </Row>
          <Row>
            <span>Taxa de entrega:</span>
            <span>R$ {deliveryFee.toFixed(2)}</span>
          </Row>
          <TotalRow>
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </TotalRow>
        </Summary>

        <Button onClick={handlePayment}>Realizar Pagamento</Button>
      </Modal>
    </Overlay>
  );
};

export default Payment;

// --- Styled Components (sem alterações) ---
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  width: 400px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
`;

const Header = styled.div`
  background: #f5f5f5;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 { margin: 0; }
  .close-btn {
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
`;

const Section = styled.div`
  padding: 15px 20px;
  label { display: block; margin-bottom: 8px; font-weight: 500; }
  input[type="text"] {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
`;

const Option = styled.div`
  margin: 5px 0;
  input { margin-right: 10px; }
`;

const Summary = styled.div`
  background: #f7941d;
  padding: 15px 20px;
  color: #fff;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const TotalRow = styled(Row)`
  font-weight: 700;
  border-top: 1px solid rgba(255,255,255,0.5);
  padding-top: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: #043d16;
  color: #fff;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  &:hover { background: #03520f; }
`;
