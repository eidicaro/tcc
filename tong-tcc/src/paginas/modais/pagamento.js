import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const PaymentPage = ({ subtotal, onClose, carrinho }) => {
  const [deliveryFee] = useState(3);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [needChange, setNeedChange] = useState("");
  const [changeValue, setChangeValue] = useState("");
  const [observation, setObservation] = useState(""); // 🟢 novo campo
  const [isLocalOrder, setIsLocalOrder] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // 🟢 novo estado de feedback

  const total = Number(subtotal) + (isLocalOrder ? 0 : Number(deliveryFee));

  useEffect(() => {
    axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
  }, []);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ type: "", message: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handlePayment = async () => {
    if (!isLocalOrder && (!address.trim() || !paymentMethod)) {
      setStatus({ type: "error", message: "Preencha todos os campos obrigatórios." });
      return;
    }
    if (isLocalOrder && !paymentMethod) {
      setStatus({ type: "error", message: "Selecione a forma de pagamento." });
      return;
    }
    if (paymentMethod === "Dinheiro" && needChange === "Sim" && !changeValue) {
      setStatus({ type: "error", message: "Informe o valor para o troco." });
      return;
    }

    // const cliente = JSON.parse(localStorage.getItem("cliente"));
    // if (!cliente || !cliente.id) {
    //   setStatus({ type: "error", message: "Erro: cliente não encontrado." });
    //   return;
    // }

    const carrinhoPayload = carrinho.map(item => ({
      produto_id: item.id_produto || item.produto_id,
      nome: item.nome,
      preco: Number(item.preco || 0),
      quantidade: Number(item.quantidade || 1),
      adicionais: (item.adicionais || []).map(add => ({
        adicional_id: add.id_adicional || add.adicional_id,
        nome: add.nome,
        preco: Number(add.preco || 0),
        quantidade: Number(add.quantidade || 1),
      })),
    }));

    const cliente = JSON.parse(localStorage.getItem("cliente"));

    if (!cliente || !cliente.id) {
      alert("Erro: cliente não encontrado. Faça o cadastro novamente.");
      return;
    }


    const pedidoJSON = {
      tipo_pedido: isLocalOrder ? "local" : "delivery",
      tipo_pedido: isLocalOrder ? "local" : "delivery",
      endereco: isLocalOrder ? null : address,
      forma_pagamento: paymentMethod,
      total,
      carrinho: carrinhoPayload,
      cliente_id: cliente.id,
      valor_troco: paymentMethod === "Dinheiro" && needChange === "Sim" ? changeValue : null, // 🟢 novo campo
      observacao: observation, // 🟢 novo campo
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/pedidos/finalizar",
        pedidoJSON,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setStatus({ type: "success", message: "Pedido realizado com sucesso!" });
      setTimeout(() => onClose(), 1500); // fecha depois de 1.5s
    } catch (err) {
      const errorData = err.response?.data;
      console.error("Erro ao finalizar pedido:", errorData || err);
      setStatus({
        type: "error",
        message: errorData?.message || "Erro ao finalizar pedido. Tente novamente.",
      });
    }
  };

  const isPayDisabled =
    !paymentMethod ||
    (!isLocalOrder && !address.trim()) ||
    (paymentMethod === "Dinheiro" && needChange === "Sim" && !changeValue);

  return (
    <Overlay>
      <Card>
        <Header>
          <h2>Finalizar pedido</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </Header>

        <Content>
          <SmallNote>Hoje: 40 - 90 min</SmallNote>

          <Option>
            <input
              type="checkbox"
              id="localOrder"
              checked={isLocalOrder}
              onChange={() => setIsLocalOrder(!isLocalOrder)}
            />
            <span>Pedido Local</span>
          </Option>

          {!isLocalOrder && (
            <Field>
              <label>Endereço</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>
          )}

          <Field>
            <label>Forma de Pagamento</label>
            <Options>
              {["Cartão Débito/Crédito", "Pix", "Dinheiro"].map((m) => (
                <Option key={m}>
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    checked={paymentMethod === m}
                    onChange={() => {
                      setPaymentMethod(m);
                      setNeedChange("");
                      setChangeValue("");
                    }}
                  />
                  <span>{m}</span>
                </Option>
              ))}
            </Options>
          </Field>

          {paymentMethod === "Dinheiro" && (
            <Field>
              <label>Deseja troco?</label>
              <Options>
                {["Sim", "Não"].map((opt) => (
                  <Option key={opt}>
                    <input
                      type="radio"
                      name="needChange"
                      value={opt}
                      checked={needChange === opt}
                      onChange={() => {
                        setNeedChange(opt);
                        if (opt === "Não") setChangeValue("");
                      }}
                    />
                    <span>{opt}</span>
                  </Option>
                ))}
              </Options>

              {needChange === "Sim" && (
                <div style={{ marginTop: "8px" }}>
                  <label>Valor para troco:</label>
                  <input
                    type="number"
                    placeholder="Ex: 200"
                    value={changeValue}
                    onChange={(e) => setChangeValue(e.target.value)}
                    style={{ marginTop: "6px", width: "100%", padding: "8px" }}
                  />
                </div>
              )}
            </Field>
          )}

          {/* 🟢 Campo de observação */}
          <Field>
            <label>Observações</label>
            <textarea
              rows="3"
              placeholder="Ex: sem cebola, molho separado..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #cfcfcf",
                resize: "none",
              }}
            />
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
              <strong>R$ {isLocalOrder ? "0.00" : deliveryFee.toFixed(2)}</strong>
            </div>
            <hr />
            <div className="total-row">
              <span>Total:</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          </Totals>

          {/* 🟢 Mensagem de status */}
          {status.message && (
            <StatusMessage type={status.type}>{status.message}</StatusMessage>
          )}

          <PayButton onClick={handlePayment} disabled={isPayDisabled}>
            Realizar Pagamento
          </PayButton>
        </Footer>
      </Card>
    </Overlay>
  );
};

export default PaymentPage;

// ============ STYLED COMPONENTS ============
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
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

  h2 {
    margin: 0;
    font-weight: 700;
  }

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
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
  }
  input[type="text"],
  input[type="number"] {
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
    margin-right: 8px;
  }
`;

const Footer = styled.div`
  background: #f07f2d;
  padding: 18px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Totals = styled.div`
  color: #fff;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 6px 0;
  }
  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    margin: 8px 0;
  }
  .total-row {
    font-weight: 700;
    font-size: 18px;
  }
`;

const StatusMessage = styled.div`
  background: ${({ type }) => (type === "success" ? "#d4edda" : "#f8d7da")};
  color: ${({ type }) => (type === "success" ? "#155724" : "#721c24")};
  border: 1px solid ${({ type }) => (type === "success" ? "#c3e6cb" : "#f5c6cb")};
  padding: 10px 14px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  animation: fadein 0.3s ease;
`;

const PayButton = styled.button`
  align-self: center;
  width: 260px;
  padding: 12px 16px;
  background: #0b4e31;
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
