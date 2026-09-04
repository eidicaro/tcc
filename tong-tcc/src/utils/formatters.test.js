import { describe, expect, it } from "vitest";
import {
  createOrderToken,
  formatCurrency,
  normalizeSearch,
  safeJsonParse,
  whatsappUrl,
} from "./formatters";

describe("formatters", () => {
  it("formata valores no padrão brasileiro sem propagar NaN", () => {
    expect(formatCurrency(19.9)).toMatch(/R\$\s?19,90/);
    expect(formatCurrency("inválido")).toMatch(/R\$\s?0,00/);
  });

  it("normaliza acentos para busca e monta WhatsApp brasileiro", () => {
    expect(normalizeSearch("  Temáki Filadélfia ")).toBe("temaki filadelfia");
    expect(whatsappUrl("(15) 99999-0000", "Olá!")).toBe(
      "https://wa.me/5515999990000?text=Ol%C3%A1!",
    );
  });

  it("trata JSON corrompido e gera tokens distintos", () => {
    expect(safeJsonParse("{", { safe: true })).toEqual({ safe: true });
    expect(createOrderToken()).not.toBe(createOrderToken());
  });
});

