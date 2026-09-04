import { describe, expect, it } from "vitest";
import {
  getCartQuantity,
  getCartSubtotal,
  getItemTotal,
  getItemUnitTotal,
  moneyToCents,
} from "./cartMath";

const cart = [
  {
    price: 20,
    quantity: 2,
    additionals: [
      { price: 3, quantity: 2 },
      { price: 1.5, quantity: 1 },
    ],
  },
  { preco: "10.00", quantidade: 1, adicionais: [] },
];

describe("cartMath", () => {
  it("calcula adicionais por unidade antes da quantidade do produto", () => {
    expect(getItemUnitTotal(cart[0])).toBe(27.5);
    expect(getItemTotal(cart[0])).toBe(55);
  });

  it("calcula subtotal e quantidade total", () => {
    expect(getCartSubtotal(cart)).toBe(65);
    expect(getCartQuantity(cart)).toBe(3);
  });

  it("neutraliza valores ausentes ou negativos", () => {
    expect(getItemTotal({ price: undefined, quantity: -2 })).toBe(0);
    expect(getCartSubtotal()).toBe(0);
  });

  it("calcula valores decimais em centavos sem bloquear mínimos exatos", () => {
    expect(getCartSubtotal([
      { price: 10.1, quantity: 1 },
      { price: 10.2, quantity: 1 },
    ])).toBe(20.3);
    expect(moneyToCents(0.1 + 0.2)).toBe(30);
    expect(moneyToCents(20.3)).toBe(2030);
  });
});
