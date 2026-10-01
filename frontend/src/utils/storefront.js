const RESTAURANT_TYPES = new Set(["restaurant", "restaurante", "food", "food-service"]);

export function getStoreVocabulary(store = {}) {
  const businessType = String(store.businessType || "restaurant").trim().toLocaleLowerCase("pt-BR");
  const isRestaurant = RESTAURANT_TYPES.has(businessType);

  return {
    isRestaurant,
    catalog: isRestaurant ? "Cardápio" : "Catálogo",
    catalogLower: isRestaurant ? "cardápio" : "catálogo",
    brandDescriptor: isRestaurant ? "Experiência à mesa" : "Experiência de compra",
    heroEyebrow: isRestaurant ? "Feito no tempo certo" : "Escolhas com curadoria",
    serviceLabel: isRestaurant ? "Preparo" : "Atendimento",
    serviceValue: isRestaurant ? "Sob pedido" : "Cuidado em cada etapa",
    featuredEyebrow: isRestaurant ? "Favoritos da casa" : "Destaques da loja",
    storyEyebrow: isRestaurant ? "Da cozinha à sua mesa" : "Da escolha até você",
    storyTitle: isRestaurant ? "Menos pressa. Mais intenção." : "Menos atrito. Mais cuidado.",
    storyBody: isRestaurant
      ? "Cada pedido percorre uma sequência cuidadosa: seleção, preparo, equilíbrio e apresentação. O resultado é simples de pedir e especial de receber."
      : "Cada pedido percorre uma sequência clara: escolha, confirmação, preparação e entrega. O resultado é simples para quem compra e organizado para quem atende.",
    searchPlaceholder: isRestaurant
      ? "Buscar por nome ou ingrediente"
      : "Buscar por nome ou detalhe",
  };
}
