import { describe, expect, it } from "vitest";
import { normalizeTheme } from "./StoreContext";

describe("normalizeTheme", () => {
  it("preserva uma paleta semanticamente acessível", () => {
    expect(normalizeTheme({
      ink: "#111111",
      orange: "#F48347",
      green: "#03391D",
      surface: "#F8F5EF",
      muted: "#D9D9D9",
    })).toEqual({
      ink: "#111111",
      orange: "#F48347",
      green: "#03391D",
      surface: "#F8F5EF",
      muted: "#D9D9D9",
    });
  });

  it("substitui cores que quebrariam o contraste estrutural", () => {
    expect(normalizeTheme({
      ink: "#FFFFFF",
      orange: "#111111",
      green: "#FFFFFF",
      surface: "#111111",
    })).toMatchObject({
      ink: "#111111",
      orange: "#F48347",
      green: "#03391D",
      surface: "#F8F5EF",
    });
  });
});
