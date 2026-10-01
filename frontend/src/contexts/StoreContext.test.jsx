import { describe, expect, it } from "vitest";
import { normalizeTheme } from "./StoreContext";

describe("normalizeTheme", () => {
  it("preserva uma paleta semanticamente acessível", () => {
    expect(normalizeTheme({
      ink: "#152D35",
      orange: "#C49347",
      green: "#123C4A",
      surface: "#F7F4EC",
      muted: "#CDD6D2",
    })).toEqual({
      ink: "#152D35",
      orange: "#C49347",
      green: "#123C4A",
      surface: "#F7F4EC",
      muted: "#CDD6D2",
    });
  });

  it("substitui cores que quebrariam o contraste estrutural", () => {
    expect(normalizeTheme({
      ink: "#FFFFFF",
      orange: "#152D35",
      green: "#FFFFFF",
      surface: "#152D35",
    })).toMatchObject({
      ink: "#152D35",
      orange: "#C49347",
      green: "#123C4A",
      surface: "#F7F4EC",
    });
  });
});
