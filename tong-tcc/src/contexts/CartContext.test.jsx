import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../services/api";
import { CartProvider, useCart } from "./CartContext";

vi.mock("../services/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  ensureCsrfCookie: vi.fn().mockResolvedValue(undefined),
  getErrorMessage: vi.fn((error, fallback) => error?.message || fallback),
}));

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe("CartProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: { carrinho: [] } });
    api.delete.mockResolvedValue({ data: { carrinho: [] } });
  });

  it("envia apenas o contrato seguro ao adicionar produto", async () => {
    api.post.mockResolvedValue({
      data: {
        carrinho: [
          { uid: "item-1", produto_id: 8, nome: "Combinado", preco: 40, quantidade: 2 },
        ],
      },
    });
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() =>
      result.current.addItem({
        id: 8,
        name: "Combinado",
        quantity: 2,
        additionals: [{ id: 3, quantity: 2, price: 99 }],
      }),
    );

    expect(api.post).toHaveBeenCalledWith("/carrinho/adicionar", {
      produto_id: 8,
      quantidade: 2,
      adicionais: [{ adicional_id: 3, quantidade: 2 }],
    });
    expect(result.current.itemCount).toBe(2);
    expect(result.current.subtotal).toBe(80);
  });

  it("limita quantidades e adicionais antes de chamar a API", async () => {
    api.post.mockResolvedValue({ data: { carrinho: [] } });
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const additionals = Array.from({ length: 35 }, (_, index) => ({
      id: index + 1,
      quantity: 500,
    }));

    await act(() => result.current.addItem({ id: 9, quantity: 500, additionals }));

    const payload = api.post.mock.calls[0][1];
    expect(payload.quantidade).toBe(99);
    expect(payload.adicionais).toHaveLength(30);
    expect(payload.adicionais.every((additional) => additional.quantidade === 99)).toBe(true);
  });

  it("atualiza quantidade de forma otimista e confirma com PATCH", async () => {
    api.get.mockResolvedValue({
      data: { carrinho: [{ uid: "abc", produto_id: 1, nome: "Temaki", preco: 20, quantidade: 1 }] },
    });
    api.patch.mockResolvedValue({
      data: {
        carrinho: [{ uid: "abc", produto_id: 1, nome: "Temaki", preco: 20, quantidade: 3 }],
      },
    });
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.itemCount).toBe(1));

    await act(() => result.current.updateQuantity("abc", 3));

    expect(api.patch).toHaveBeenCalledWith("/carrinho/atualizar/abc", { quantidade: 3 });
    expect(result.current.itemCount).toBe(3);
  });

  it("reflete localmente o carrinho limpo após checkout sem repetir o DELETE", async () => {
    api.get.mockResolvedValue({
      data: { carrinho: [{ uid: "pedido", produto_id: 1, nome: "Produto", preco: 20, quantidade: 1 }] },
    });
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.itemCount).toBe(1));

    act(() => result.current.completeCheckout());

    expect(result.current.itemCount).toBe(0);
    expect(api.delete).not.toHaveBeenCalled();
  });
});
