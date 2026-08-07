import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api, ensureCsrfCookie, getErrorMessage } from "../services/api";
import { getCartQuantity, getCartSubtotal } from "./cartMath";

const CartContext = createContext(null);
const MAX_ITEM_QUANTITY = 99;

function boundedQuantity(value, fallback = 1) {
  const quantity = Math.trunc(Number(value));
  return Number.isFinite(quantity)
    ? Math.min(MAX_ITEM_QUANTITY, Math.max(1, quantity))
    : fallback;
}

function normalizeAdditional(additional) {
  return {
    ...additional,
    id: additional.id_adicional ?? additional.adicional_id ?? additional.id,
    name: additional.nome ?? additional.name ?? "Adicional",
    price: Number(additional.preco ?? additional.preco_unitario ?? additional.price ?? 0),
    quantity: Number(additional.quantidade ?? additional.quantity ?? 1),
  };
}

function normalizeItem(item) {
  return {
    ...item,
    uid: String(item.uid ?? item.id_item ?? item.id),
    productId: item.id_produto ?? item.produto_id ?? item.produto?.id ?? item.id,
    name: item.nome ?? item.produto?.nome ?? item.name ?? "Produto",
    price: Number(item.preco ?? item.preco_unitario ?? item.produto?.preco ?? item.price ?? 0),
    quantity: Number(item.quantidade ?? item.quantity ?? 1),
    image: item.imagem_url ?? item.imagem ?? item.produto?.imagem_url ?? item.produto?.imagem,
    additionals: (item.adicionais ?? item.additionals ?? []).map(normalizeAdditional),
  };
}

function extractCart(payload) {
  const value = payload?.carrinho ?? payload?.cart ?? payload?.data;
  return Array.isArray(value) ? value.map(normalizeItem) : null;
}

function additionalPayload(additionals = []) {
  return additionals
    .map((additional) => ({
      adicional_id:
        additional.adicional_id ?? additional.id_adicional ?? additional.id,
      quantidade: boundedQuantity(additional.quantidade ?? additional.quantity ?? 1),
    }))
    .filter((additional) => additional.adicional_id != null && additional.quantidade > 0)
    .slice(0, 30);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingKeys, setPendingKeys] = useState(() => new Set());
  const [toast, setToast] = useState(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const toastTimer = useRef();
  const mounted = useRef(true);
  const pendingRef = useRef(new Set());
  const mutationQueue = useRef(Promise.resolve());

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  const notify = useCallback((message, tone = "success") => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, tone });
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const markPending = useCallback((key, active) => {
    const next = new Set(pendingRef.current);
    if (active) next.add(key);
    else next.delete(key);
    pendingRef.current = next;
    setPendingKeys(next);
  }, []);

  const refreshCart = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await api.get("/carrinho/listar");
      const cart = extractCart(response.data) ?? [];
      if (mounted.current) setItems(cart);
      return cart;
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Não foi possível carregar o carrinho.");
      if (mounted.current) setError(message);
      return null;
    } finally {
      if (mounted.current && !silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const prepareMutation = useCallback(async () => {
    // Alguns backends usam sessão sem CSRF nas rotas /api. A falha do cookie não
    // deve bloquear o pedido; a própria mutação continuará protegida pelo servidor.
    await ensureCsrfCookie().catch(() => undefined);
  }, []);

  const enqueueMutation = useCallback((operation) => {
    const request = mutationQueue.current.then(operation, operation);
    mutationQueue.current = request.catch(() => undefined);
    return request;
  }, []);

  const addItem = useCallback(
    async (product, quantity = 1, additionals = []) => {
      const productId = product.produto_id ?? product.id_produto ?? product.id;
      const selectedAdditionals = product.adicionais ?? product.additionals ?? additionals;
      const productQuantity = boundedQuantity(product.quantidade ?? product.quantity ?? quantity);
      const lockKey = `add:${productId}:${JSON.stringify(additionalPayload(selectedAdditionals))}`;
      if (pendingRef.current.has(lockKey)) return null;

      markPending(lockKey, true);
      setError("");
      try {
        return await enqueueMutation(async () => {
          await prepareMutation();
          const response = await api.post("/carrinho/adicionar", {
            produto_id: productId,
            quantidade: productQuantity,
            adicionais: additionalPayload(selectedAdditionals),
          });
          const cart = extractCart(response.data);
          if (cart) setItems(cart);
          else await refreshCart({ silent: true });
          notify(`${product.nome ?? product.name ?? "Produto"} adicionado ao carrinho.`);
          return response.data;
        });
      } catch (requestError) {
        const message = getErrorMessage(requestError, "Não foi possível adicionar o produto.");
        setError(message);
        notify(message, "error");
        throw requestError;
      } finally {
        markPending(lockKey, false);
      }
    },
    [enqueueMutation, markPending, notify, prepareMutation, refreshCart],
  );

  const updateQuantity = useCallback(
    async (uid, quantity) => {
      const nextQuantity = boundedQuantity(quantity);
      if (nextQuantity <= 0) return null;
      const lockKey = `update:${uid}`;
      if (pendingRef.current.has(lockKey)) return null;

      setItems((current) =>
        current.map((item) => (item.uid === String(uid) ? { ...item, quantity: nextQuantity } : item)),
      );
      markPending(lockKey, true);
      try {
        return await enqueueMutation(async () => {
          await prepareMutation();
          const response = await api.patch(`/carrinho/atualizar/${encodeURIComponent(uid)}`, {
            quantidade: nextQuantity,
          });
          const cart = extractCart(response.data);
          if (cart) setItems(cart);
          else await refreshCart({ silent: true });
          return response.data;
        });
      } catch (requestError) {
        await refreshCart({ silent: true });
        const message = getErrorMessage(requestError, "Não foi possível atualizar a quantidade.");
        notify(message, "error");
        throw requestError;
      } finally {
        markPending(lockKey, false);
      }
    },
    [enqueueMutation, markPending, notify, prepareMutation, refreshCart],
  );

  const removeItem = useCallback(
    async (uid) => {
      const lockKey = `remove:${uid}`;
      if (pendingRef.current.has(lockKey)) return null;
      setItems((current) => current.filter((item) => item.uid !== String(uid)));
      markPending(lockKey, true);
      try {
        return await enqueueMutation(async () => {
          await prepareMutation();
          const response = await api.delete(`/carrinho/remover/${encodeURIComponent(uid)}`);
          const cart = extractCart(response.data);
          if (cart) setItems(cart);
          else await refreshCart({ silent: true });
          notify("Item removido do carrinho.", "info");
          return response.data;
        });
      } catch (requestError) {
        await refreshCart({ silent: true });
        const message = getErrorMessage(requestError, "Não foi possível remover o item.");
        notify(message, "error");
        throw requestError;
      } finally {
        markPending(lockKey, false);
      }
    },
    [enqueueMutation, markPending, notify, prepareMutation, refreshCart],
  );

  const clearCart = useCallback(
    async ({ silent = false } = {}) => {
      setItems([]);
      markPending("clear", true);
      try {
        return await enqueueMutation(async () => {
          await prepareMutation();
          await api.delete("/carrinho/limpar");
          if (!silent) notify("Carrinho limpo.", "info");
          return true;
        });
      } catch (requestError) {
        await refreshCart({ silent: true });
        const message = getErrorMessage(requestError, "Não foi possível limpar o carrinho.");
        notify(message, "error");
        throw requestError;
      } finally {
        markPending("clear", false);
      }
    },
    [enqueueMutation, markPending, notify, prepareMutation, refreshCart],
  );

  const completeCheckout = useCallback(() => {
    setItems([]);
    setError("");
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const itemCount = useMemo(() => getCartQuantity(items), [items]);

  const value = useMemo(
    () => ({
      items,
      loading,
      syncing: pendingKeys.size > 0,
      pendingKeys,
      error,
      subtotal,
      itemCount,
      isCartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      toggleCart: () => setCartOpen((open) => !open),
      refreshCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      completeCheckout,
      notify,
    }),
    [
      items,
      loading,
      pendingKeys,
      error,
      subtotal,
      itemCount,
      isCartOpen,
      refreshCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      completeCheckout,
      notify,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className={`store-toast store-toast--${toast.tone}`}
          role={toast.tone === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}
