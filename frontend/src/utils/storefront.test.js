import { describe, expect, it } from "vitest";
import { getStoreVocabulary } from "./storefront";

describe("getStoreVocabulary", () => {
  it("mantém o vocabulário gastronômico para restaurantes", () => {
    const copy = getStoreVocabulary({ businessType: "restaurant" });
    expect(copy.catalog).toBe("Cardápio");
    expect(copy.storyEyebrow).toContain("cozinha");
  });

  it("adapta a experiência para lojas de outros segmentos", () => {
    const copy = getStoreVocabulary({ businessType: "retail" });
    expect(copy.catalog).toBe("Catálogo");
    expect(copy.storyEyebrow).toContain("escolha");
    expect(copy.storyBody).not.toContain("cozinha");
  });
});
