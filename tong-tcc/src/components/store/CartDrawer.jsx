import { useEffect, useState } from "react";
import { useNavigate } from "../../routing/Router";
import { FiCheckCircle, FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiX } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { useStore } from "../../contexts/StoreContext";
import { useStoreFormatting } from "../../hooks/useStoreFormatting";
import { assetUrl } from "../../services/api";
import { getItemTotal, moneyToCents } from "../../contexts/cartMath";
import { getStoreVocabulary } from "../../utils/storefront";
import AccessibleDialog from "./AccessibleDialog";
import CheckoutForm from "./CheckoutForm";

const ignoreHandledError = (operation) => {
  Promise.resolve(operation).catch(() => undefined);
};

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    loading,
    syncing,
    pendingKeys,
    error,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  } = useCart();
  const { store, commerceReady } = useStore();
  const { formatCurrency } = useStoreFormatting();
  const vocabulary = getStoreVocabulary(store);
  const [step, setStep] = useState("cart");
  const [order, setOrder] = useState(null);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);

  useEffect(() => {
    if (!isCartOpen) {
      const timer = window.setTimeout(() => {
        setStep("cart");
        setOrder(null);
        setCheckoutSubmitting(false);
      }, 250);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isCartOpen]);

  const handleClose = () => {
    if (!syncing && !checkoutSubmitting) closeCart();
  };

  return (
    <AccessibleDialog
      open={isCartOpen}
      onClose={handleClose}
      labelledBy="store-cart-title"
      variant="drawer"
    >
      <button
        type="button"
        className="store-dialog__close"
        onClick={handleClose}
        disabled={syncing || checkoutSubmitting}
        aria-label="Fechar carrinho"
      >
        <FiX aria-hidden="true" />
      </button>

      {step === "checkout" ? (
        <CheckoutForm
          onBack={() => setStep("cart")}
          onSubmittingChange={setCheckoutSubmitting}
          onSuccess={(response) => {
            setCheckoutSubmitting(false);
            setOrder(response);
            setStep("success");
          }}
        />
      ) : step === "success" ? (
        <div className="store-order-success" role="status">
          <FiCheckCircle aria-hidden="true" />
          <span className="store-eyebrow">Recebemos seu pedido</span>
          <h2 id="store-cart-title">Agora é com a gente.</h2>
          <p>
            Pedido <strong>#{order?.pedido_id ?? order?.id ?? "confirmado"}</strong>. O estabelecimento
            poderá entrar em contato pelo WhatsApp informado.
          </p>
          <small>Tempo estimado: {store.order.estimate}</small>
          <button type="button" className="store-button store-button--dark" onClick={closeCart}>
            Continuar navegando
          </button>
        </div>
      ) : (
        <div className="store-cart">
          <div className="store-drawer__heading">
            <span className="store-eyebrow">Seu momento</span>
            <h2 id="store-cart-title">Seu pedido</h2>
            {items.length > 0 && (
              <button type="button" className="store-text-button" onClick={() => ignoreHandledError(clearCart())} disabled={syncing}>
                Limpar
              </button>
            )}
          </div>

          <div className="store-cart__items" aria-busy={loading || syncing}>
            {loading ? (
              <div className="store-cart__loading">Organizando seu carrinho…</div>
            ) : error && items.length === 0 ? (
              <div className="store-cart__empty" role="alert">
                <FiShoppingBag aria-hidden="true" />
                <h3>Não foi possível carregar seu pedido</h3>
                <p>{error}</p>
                <button type="button" className="store-button store-button--dark" onClick={() => refreshCart()}>
                  Tentar novamente
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="store-cart__empty">
                <FiShoppingBag aria-hidden="true" />
                <h3>Seu pedido começa aqui</h3>
                <p>Explore o {vocabulary.catalogLower} e escolha algo especial.</p>
                <button
                  type="button"
                  className="store-button store-button--dark"
                  onClick={() => {
                    closeCart();
                    navigate("/cardapio");
                  }}
                >
                  Ver {vocabulary.catalogLower}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemPending =
                  pendingKeys.has(`update:${item.uid}`) || pendingKeys.has(`remove:${item.uid}`);
                return (
                  <article className="store-cart-item" key={item.uid} aria-busy={itemPending}>
                    <div className="store-cart-item__image">
                      {item.image ? <img src={assetUrl(item.image)} alt="" /> : <span aria-hidden="true">✦</span>}
                    </div>
                    <div className="store-cart-item__body">
                      <div className="store-cart-item__title">
                        <h3>{item.name}</h3>
                        <button
                          type="button"
                          className="store-icon-button"
                          onClick={() => ignoreHandledError(removeItem(item.uid))}
                          disabled={syncing}
                          aria-label={`Remover ${item.name}`}
                        >
                          <FiTrash2 aria-hidden="true" />
                        </button>
                      </div>
                      {item.additionals.length > 0 && (
                        <ul>
                          {item.additionals.map((additional) => (
                            <li key={`${item.uid}-${additional.id}`}>
                              {additional.quantity}× {additional.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="store-cart-item__footer">
                        <div className="store-stepper">
                          <button
                            type="button"
                            onClick={() => ignoreHandledError(
                              item.quantity <= 1
                                ? removeItem(item.uid)
                                : updateQuantity(item.uid, item.quantity - 1),
                            )}
                            disabled={syncing}
                            aria-label={`Diminuir quantidade de ${item.name}`}
                          >
                            <FiMinus aria-hidden="true" />
                          </button>
                          <output>{item.quantity}</output>
                          <button
                            type="button"
                            onClick={() => ignoreHandledError(updateQuantity(item.uid, item.quantity + 1))}
                            disabled={syncing || item.quantity >= 99}
                            aria-label={`Aumentar quantidade de ${item.name}`}
                          >
                            <FiPlus aria-hidden="true" />
                          </button>
                        </div>
                        <strong>{formatCurrency(getItemTotal(item))}</strong>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="store-cart__summary">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <p>Taxa de entrega calculada na próxima etapa.</p>
              <button
                type="button"
                className="store-button store-button--primary"
                onClick={() => setStep("checkout")}
                disabled={!commerceReady || syncing || moneyToCents(subtotal) < moneyToCents(store.order.minimum)}
              >
                Continuar para finalizar
              </button>
              {!commerceReady && <small>Pedidos pausados até a configuração da loja ser validada.</small>}
              {moneyToCents(subtotal) < moneyToCents(store.order.minimum) && (
                <small>Pedido mínimo: {formatCurrency(store.order.minimum)}</small>
              )}
            </div>
          )}
        </div>
      )}
    </AccessibleDialog>
  );
}
