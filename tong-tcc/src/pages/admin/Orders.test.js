import { describe, expect, it } from "vitest";
import { orderItemTotal } from "./Orders";

describe("orderItemTotal", () => {
  it("inclui adicionais e quantidade do produto no total da linha", () => {
    expect(orderItemTotal({
      preco_unitario: 20,
      quantidade: 2,
      adicionais: [
        { preco_unitario: 5, quantidade: 1 },
        { preco_unitario: 2, quantidade: 2 },
      ],
    })).toBe(58);
  });
});
