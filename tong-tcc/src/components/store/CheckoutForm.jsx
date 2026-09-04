import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiCheck, FiLock } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { useStore } from "../../contexts/StoreContext";
import { useStoreFormatting } from "../../hooks/useStoreFormatting";
import { api, ensureCsrfCookie, getErrorMessage } from "../../services/api";
import { centsToMoney, moneyToCents } from "../../contexts/cartMath";
import {
  createOrderToken,
  digitsOnly,
  safeJsonParse,
} from "../../utils/formatters";

const CUSTOMER_STORAGE_KEY = "store_customer";
const DEFAULT_FULFILLMENT = ["delivery", "local"];
const DEFAULT_PAYMENT_METHODS = ["Pix", "Cartão", "Dinheiro"];

function storedCustomer() {
  if (typeof window === "undefined") return {};
  try {
    const current = safeJsonParse(window.localStorage.getItem(CUSTOMER_STORAGE_KEY), null);
    if (current) return current;

    const legacy = safeJsonParse(window.localStorage.getItem("cliente"), {}) ?? {};
    if (Object.keys(legacy).length) {
      window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(legacy));
    }
    window.localStorage.removeItem("cliente");
    return legacy;
  } catch {
    return {};
  }
}

function persistCustomer(customer, remember) {
  try {
    if (remember) {
      window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    } else {
      window.localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      window.localStorage.removeItem("cliente");
    }
  } catch {
    // Persistência local é apenas conveniência e nunca deve bloquear o pedido.
  }
}

export default function CheckoutForm({ onBack, onSuccess, onSubmittingChange }) {
  const saved = useMemo(storedCustomer, []);
  const { store, commerceReady } = useStore();
  const { subtotal, completeCheckout, notify } = useCart();
  const { formatCurrency } = useStoreFormatting();
  const [customer, setCustomer] = useState({
    name: saved.nome ?? saved.name ?? "",
    phone: saved.telefone ?? saved.phone ?? "",
  });
  const fulfillmentOptions = Array.isArray(store.order.fulfillment)
    ? store.order.fulfillment
    : DEFAULT_FULFILLMENT;
  const paymentOptions = Array.isArray(store.order.paymentMethods)
    ? store.order.paymentMethods
    : DEFAULT_PAYMENT_METHODS;
  const [fulfillment, setFulfillment] = useState(fulfillmentOptions[0]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [needsChange, setNeedsChange] = useState(false);
  const [changeFor, setChangeFor] = useState("");
  const [observation, setObservation] = useState("");
  const [remember, setRemember] = useState(Boolean(
    (saved.nome ?? saved.name) && (saved.telefone ?? saved.phone),
  ));
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const orderToken = useRef(createOrderToken());
  const errorRef = useRef(null);

  useEffect(() => {
    setFulfillment((current) => (
      fulfillmentOptions.includes(current) ? current : fulfillmentOptions[0] ?? ""
    ));
  }, [fulfillmentOptions]);

  useEffect(() => {
    setPaymentMethod((current) => (paymentOptions.includes(current) ? current : ""));
  }, [paymentOptions]);

  const isDelivery = fulfillment === "delivery";
  const isCash = paymentMethod.toLocaleLowerCase("pt-BR").includes("dinheiro");
  const deliveryFeeCents = isDelivery ? moneyToCents(store.order.deliveryFee) : 0;
  const deliveryFee = centsToMoney(deliveryFeeCents);
  const totalCents = moneyToCents(subtotal) + deliveryFeeCents;
  const total = centsToMoney(totalCents);
  const belowMinimum = moneyToCents(subtotal) < moneyToCents(store.order.minimum);
  const orderingUnavailable = !commerceReady || fulfillmentOptions.length === 0 || paymentOptions.length === 0;

  const validate = () => {
    if (orderingUnavailable) return "Os pedidos estão temporariamente indisponíveis.";
    if (customer.name.trim().length < 2) return "Informe seu nome.";
    if (digitsOnly(customer.phone).length < 10) return "Informe um telefone válido com DDD.";
    if (isDelivery && address.trim().length < 8) return "Informe o endereço completo para entrega.";
    if (!paymentMethod) return "Escolha uma forma de pagamento.";
    if (isCash && needsChange && moneyToCents(changeFor) < totalCents) {
      return `O valor para troco deve ser igual ou maior que ${formatCurrency(total)}.`;
    }
    if (belowMinimum) {
      return `O pedido mínimo é ${formatCurrency(store.order.minimum)}.`;
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const validationMessage = validate();
    if (validationMessage) {
      setFormError(validationMessage);
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setSubmitting(true);
    onSubmittingChange?.(true);
    setFormError("");
    try {
      await ensureCsrfCookie();
      const customerToRemember = {
        nome: customer.name.trim(),
        telefone: customer.phone.trim(),
      };

      // O carrinho e os preços são recuperados da sessão pelo backend. Não envie
      // itens ou total calculado no navegador como fonte de verdade.
      const orderResponse = await api.post("/pedidos/finalizar", {
        pedido_token: orderToken.current,
        tipo_pedido: fulfillment,
        endereco: isDelivery ? address.trim() : null,
        forma_pagamento: paymentMethod,
        troco: isCash && needsChange ? Number(changeFor) : null,
        observacao: observation.trim() || null,
        cliente: customerToRemember,
      });

      // O backend finaliza e limpa a sessão na mesma transação lógica; aqui
      // apenas refletimos localmente o carrinho vazio retornado pela API.
      persistCustomer(customerToRemember, remember);
      completeCheckout();
      onSubmittingChange?.(false);
      onSuccess(orderResponse.data);
      orderToken.current = createOrderToken();
    } catch (error) {
      const message = getErrorMessage(error, "Não foi possível enviar o pedido.");
      setFormError(message);
      notify(message, "error");
      setSubmitting(false);
      onSubmittingChange?.(false);
      window.requestAnimationFrame(() => errorRef.current?.focus());
    }
  };

  return (
    <form className="store-checkout" onSubmit={handleSubmit} noValidate>
      <div className="store-drawer__heading">
        <button
          type="button"
          className="store-icon-button"
          onClick={onBack}
          disabled={submitting}
          aria-label="Voltar ao carrinho"
        >
          <FiArrowLeft aria-hidden="true" />
        </button>
        <div>
          <span className="store-eyebrow">Último passo</span>
          <h2 id="store-cart-title">Finalizar pedido</h2>
        </div>
      </div>

      <div className="store-checkout__scroll">
        <fieldset className="store-checkout__section">
          <legend>Como você quer receber?</legend>
          <div className="store-choice-grid">
            {fulfillmentOptions.map((option) => (
              <label key={option} className={fulfillment === option ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="fulfillment"
                  value={option}
                  checked={fulfillment === option}
                  onChange={() => setFulfillment(option)}
                />
                <span>{option === "delivery" ? "Entrega" : "Retirada no local"}</span>
                <small>{option === "delivery" ? store.order.estimate : "Sem taxa de entrega"}</small>
              </label>
            ))}
          </div>
          {fulfillmentOptions.length === 0 && (
            <p className="store-inline-note" role="status">Entrega e retirada estão pausadas no momento.</p>
          )}
        </fieldset>

        <fieldset className="store-checkout__section">
          <legend>Seus dados</legend>
          <div className="store-field-grid">
            <label className="store-field">
              <span>Nome</span>
              <input
                type="text"
                value={customer.name}
                onChange={(event) => setCustomer((value) => ({ ...value, name: event.target.value }))}
                autoComplete="name"
                maxLength={100}
                required
              />
            </label>
            <label className="store-field">
              <span>WhatsApp</span>
              <input
                type="tel"
                value={customer.phone}
                onChange={(event) => setCustomer((value) => ({ ...value, phone: event.target.value }))}
                placeholder="(15) 99999-9999"
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
                required
              />
            </label>
          </div>
          <label className="store-check">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            <span>Lembrar meus dados neste dispositivo</span>
          </label>
        </fieldset>

        {isDelivery && (
          <fieldset className="store-checkout__section">
            <legend>Endereço de entrega</legend>
            <label className="store-field">
              <span>Rua, número, bairro e complemento</span>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows="3"
                autoComplete="street-address"
                maxLength={255}
                required
              />
            </label>
          </fieldset>
        )}

        <fieldset className="store-checkout__section">
          <legend>Pagamento na entrega/retirada</legend>
          <div className="store-payment-options">
            {paymentOptions.map((method) => (
              <label key={method} className={paymentMethod === method ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => {
                    setPaymentMethod(method);
                    setNeedsChange(false);
                    setChangeFor("");
                  }}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
          {paymentOptions.length === 0 && (
            <p className="store-inline-note" role="status">Nenhuma forma de pagamento está disponível.</p>
          )}

          {isCash && (
            <div className="store-change-box">
              <label className="store-check">
                <input
                  type="checkbox"
                  checked={needsChange}
                  onChange={(event) => setNeedsChange(event.target.checked)}
                />
                <span>Preciso de troco</span>
              </label>
              {needsChange && (
                <label className="store-field">
                  <span>Troco para quanto?</span>
                  <input
                    type="number"
                    min={total}
                    step="0.01"
                    value={changeFor}
                    onChange={(event) => setChangeFor(event.target.value)}
                    inputMode="decimal"
                    required
                  />
                </label>
              )}
            </div>
          )}
        </fieldset>

        <fieldset className="store-checkout__section">
          <legend>Alguma observação?</legend>
          <label className="store-field">
            <span className="store-sr-only">Observações do pedido</span>
            <textarea
              value={observation}
              onChange={(event) => setObservation(event.target.value)}
              rows="3"
              maxLength="500"
              placeholder="Ex.: sem cebola, molho separado…"
            />
          </label>
        </fieldset>

        {formError && (
          <p className="store-form-error" role="alert" ref={errorRef} tabIndex="-1">
            {formError}
          </p>
        )}
      </div>

      <div className="store-checkout__summary">
        <p><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></p>
        <p><span>Taxa de entrega</span><strong>{deliveryFee ? formatCurrency(deliveryFee) : "Grátis"}</strong></p>
        <p className="store-checkout__total"><span>Total estimado</span><strong>{formatCurrency(total)}</strong></p>
        <button type="submit" className="store-button store-button--primary" disabled={submitting || belowMinimum || orderingUnavailable}>
          {submitting ? "Enviando pedido…" : <><FiLock aria-hidden="true" /> Confirmar pedido</>}
        </button>
        <small><FiCheck aria-hidden="true" /> Valores e disponibilidade são confirmados pelo estabelecimento.</small>
      </div>
    </form>
  );
}
