const ALIASES = {
  restaurant: new Set(["restaurant", "restaurante", "food", "food-service"]),
  market: new Set(["market", "grocery", "supermarket", "mercado", "mercearia"]),
  pharmacy: new Set(["pharmacy", "farmacia", "farmácia", "drogaria"]),
  pet: new Set(["pet", "pet_shop", "pet-shop", "petshop"]),
};

const COPY = {
  restaurant: {
    catalog: "Cardápio", catalogLower: "cardápio",
    brandDescriptor: "Experiência à mesa", heroEyebrow: "Feito no tempo certo",
    serviceLabel: "Preparo", serviceValue: "Sob pedido",
    featuredEyebrow: "Favoritos da casa", storyEyebrow: "Da cozinha à sua mesa",
    storyTitle: "Menos pressa. Mais intenção.",
    storyBody: "Cada pedido percorre uma sequência cuidadosa: seleção, preparo, equilíbrio e apresentação. O resultado é simples de pedir e especial de receber.",
    searchPlaceholder: "Buscar por nome ou ingrediente",
    menuIntro: "Encontre seu favorito, ajuste os detalhes e acompanhe o pedido em um só lugar.",
    extrasLegend: "Complete seu pedido", extrasHelp: "Os adicionais são calculados por unidade do produto.",
    notePlaceholder: "Ex.: sem cebola, molho separado…",
  },
  market: {
    catalog: "Produtos", catalogLower: "catálogo",
    brandDescriptor: "Mercado perto de você", heroEyebrow: "O essencial para o dia a dia",
    serviceLabel: "Seleção", serviceValue: "Itens escolhidos com cuidado",
    featuredEyebrow: "Ofertas e destaques", storyEyebrow: "Da lista à sua porta",
    storyTitle: "Suas compras com mais praticidade.",
    storyBody: "Escolha os produtos, confira os detalhes e receba suas compras no endereço informado.",
    searchPlaceholder: "Buscar produto ou marca",
    menuIntro: "Escolha os itens da sua lista e acompanhe o pedido em um só lugar.",
    extrasLegend: "Opções do produto", extrasHelp: "As opções são calculadas por unidade.",
    notePlaceholder: "Ex.: preferência de tamanho ou substituição…",
  },
  pharmacy: {
    catalog: "Produtos", catalogLower: "catálogo",
    brandDescriptor: "Cuidado perto de você", heroEyebrow: "Cuidado no dia a dia",
    serviceLabel: "Atendimento", serviceValue: "Com atenção ao seu pedido",
    featuredEyebrow: "Produtos em destaque", storyEyebrow: "Cuidado em cada etapa",
    storyTitle: "O que você precisa, com facilidade.",
    storyBody: "Encontre os produtos disponíveis, confira os detalhes e acompanhe seu pedido.",
    searchPlaceholder: "Buscar produto ou marca",
    menuIntro: "Consulte os produtos disponíveis e acompanhe seu pedido em um só lugar.",
    extrasLegend: "Opções do produto", extrasHelp: "As opções são calculadas por unidade.",
    notePlaceholder: "Ex.: preferência de embalagem…",
  },
  pet: {
    catalog: "Produtos", catalogLower: "catálogo",
    brandDescriptor: "Para cuidar do seu pet", heroEyebrow: "Cuidado para quem faz parte da família",
    serviceLabel: "Seleção", serviceValue: "Para cada fase do seu pet",
    featuredEyebrow: "Favoritos dos pets", storyEyebrow: "Do carinho à sua porta",
    storyTitle: "Mais cuidado em cada escolha.",
    storyBody: "Encontre itens para o seu pet, confira as opções e receba o pedido com praticidade.",
    searchPlaceholder: "Buscar produto ou marca",
    menuIntro: "Encontre produtos para o seu pet e acompanhe o pedido em um só lugar.",
    extrasLegend: "Opções do produto", extrasHelp: "As opções são calculadas por unidade.",
    notePlaceholder: "Ex.: tamanho ou preferência do pet…",
  },
  retail: {
    catalog: "Catálogo", catalogLower: "catálogo",
    brandDescriptor: "Experiência de compra", heroEyebrow: "Escolhas com curadoria",
    serviceLabel: "Atendimento", serviceValue: "Cuidado em cada etapa",
    featuredEyebrow: "Destaques da loja", storyEyebrow: "Da escolha até você",
    storyTitle: "Menos atrito. Mais cuidado.",
    storyBody: "Cada pedido percorre uma sequência clara: escolha, confirmação, preparação e entrega. O resultado é simples para quem compra e organizado para quem atende.",
    searchPlaceholder: "Buscar por nome ou detalhe",
    menuIntro: "Explore o catálogo, confira as opções e acompanhe o pedido em um só lugar.",
    extrasLegend: "Opções do produto", extrasHelp: "As opções são calculadas por unidade.",
    notePlaceholder: "Ex.: cor, tamanho ou preferência…",
  },
};

export function getStoreVocabulary(store = {}) {
  const rawType = String(store.businessType || "retail").trim().toLocaleLowerCase("pt-BR");
  const type = Object.entries(ALIASES)
    .find(([, names]) => names.has(rawType))?.[0] ?? "retail";

  return { ...COPY[type], type, isRestaurant: type === "restaurant" };
}
