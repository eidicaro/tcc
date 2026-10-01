import { describe, expect, it } from "vitest";
import { sortByOrderAndName } from "./catalog";

describe("sortByOrderAndName", () => {
  it("mantém o painel na mesma ordem exibida pela loja", () => {
    const sorted = sortByOrderAndName([
      { nome: "Bebida", ordem: 2 },
      { nome: "Temaki", ordem: 1 },
      { nome: "Combinado", ordem: 1 },
    ]);

    expect(sorted.map((item) => item.nome)).toEqual(["Combinado", "Temaki", "Bebida"]);
  });
});
